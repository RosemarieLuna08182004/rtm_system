import { Request, Response } from "express";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { DBTable, Error as AppError, Success } from "../../../shared";
import { UpdateService, GetService, AddService } from "../../../services";
import { logging } from "../../../utils";
import { getByEmail } from "../../../functions";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
}

interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
}

interface AuthResult {
  success: boolean;
  user?: any;
  tokens?: AuthTokens;
  error?: string;
  redirectUrl?: string;
}

export class GoogleOAuthService {
  private oauth2Client: OAuth2Client;
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  constructor() {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Missing Google OAuth configuration');
    }

    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || `${process.env.BASE_URL}/api/auth/google/callback`
    );
  }

  /**
   * Generate OAuth URL for mobile deep linking
   */
  generateAuthUrl(state?: string): string {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
      prompt: 'consent',
      state: state || this.generateState(),
      include_granted_scopes: true
    });

    logging.info('Generated OAuth URL', { url: authUrl });
    return authUrl;
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  async handleCallback(code: string, state?: string): Promise<AuthResult> {
    try {
      logging.info('Processing OAuth callback', { code: code.substring(0, 10) + '...', state });

      // Exchange code for tokens
      const { tokens } = await this.oauth2Client.getToken(code);
      
      if (!tokens.access_token) {
        throw new Error('No access token received from Google');
      }

      // Verify and decode ID token
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid ID token payload');
      }

      const profile: GoogleProfile = {
        id: payload.sub,
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture,
        verified_email: payload.email_verified || false
      };

      // Process user authentication
      const user = await this.processUserAuth(profile, tokens.access_token, tokens.refresh_token || undefined);
      
      // Generate JWT for secure token management
      const jwtToken = this.generateJWT(user);

      return {
        success: true,
        user,
        tokens: {
          accessToken: jwtToken,
          refreshToken: tokens.refresh_token || undefined,
          idToken: tokens.id_token || undefined
        }
      };

    } catch (error: any) {
      logging.error('OAuth callback error:', error);
      return {
        success: false,
        error: this.categorizeError(error)
      };
    }
  }

  /**
   * Process user authentication (create or update user)
   */
  private async processUserAuth(profile: GoogleProfile, accessToken: string, refreshToken?: string): Promise<any> {
    try {
      if (!profile.verified_email) {
        throw new Error('Email not verified by Google');
      }

      // Check for existing user
      const [existingUser] = await GetService.byFields(
        'SELECT * FROM users WHERE email = ?',
        ['Email'],
        [String],
        [profile.email]
      );

      const userData = {
        accountType: 'user',
        googleId: profile.id,
        name: profile.name,
        email: profile.email,
        // Random, never-shown password: Google accounts can't be logged in with email + password
        password: await bcrypt.hash(randomBytes(32).toString('hex'), 10),
        avatar: profile.picture || '',
        dateCreated: new Date(),
        dateUpdated: new Date(),
        accessToken: accessToken
      };

      if (!existingUser || existingUser.length === 0) {
        // Create new user
        logging.info('Creating new Google user', { email: profile.email });
        await AddService.record(
          DBTable.t007,
          Object.keys(userData),
          Object.keys(userData).map(() => String),
          Object.values(userData)
        );
      } else {
        // Update existing user
        logging.info('Updating existing Google user', { email: profile.email, id: existingUser.Id });
        await UpdateService.record(
          existingUser.Id,
          DBTable.t007,
          ['AccessToken', 'DateUpdated', 'Avatar', 'Name'],
          [String, Date, String, String],
          [accessToken, new Date(), profile.picture || '', profile.name]
        );
      }

      // Fetch final user data
      const finalUser = await getByEmail(profile.email);
      if (!finalUser?.data) {
        throw new Error('Failed to retrieve user after authentication');
      }

      return {
        ...finalUser.data,
        RefreshToken: refreshToken
      };

    } catch (error: any) {
      logging.error('User processing error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string, userId: number): Promise<AuthResult> {
    try {
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await this.oauth2Client.refreshAccessToken();

      if (!credentials.access_token) {
        throw new Error('Failed to refresh access token');
      }

      // Update user's access token in database
      await UpdateService.record(
        userId,
        DBTable.t007,
        ['AccessToken', 'DateUpdated'],
        [String, Date],
        [credentials.access_token, new Date()]
      );

      // Generate new JWT
      const user = await GetService.byFields(
        'SELECT * FROM users WHERE id = ?',
        ['Id'],
        [Number],
        [userId]
      );

      const jwtToken = this.generateJWT(user[0]);

      return {
        success: true,
        tokens: {
          accessToken: jwtToken,
          refreshToken: credentials.refresh_token || refreshToken
        }
      };

    } catch (error: any) {
      logging.error('Token refresh error:', error);
      return {
        success: false,
        error: 'Failed to refresh authentication token'
      };
    }
  }

  /**
   * Generate secure JWT token
   */
  private generateJWT(user: any): string {
    const payload = {
      userId: user.Id,
      email: user.Email,
      accountType: user.AccountType,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
      algorithm: 'HS256'
    });
  }

  /**
   * Generate secure state parameter
   */
  private generateState(): string {
    return jwt.sign(
      { 
        timestamp: Date.now(),
        nonce: Math.random().toString(36).substring(2)
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '10m' }
    );
  }

  /**
   * Verify state parameter
   */
  private verifyState(state: string): boolean {
    try {
      jwt.verify(state, process.env.JWT_SECRET || 'fallback-secret');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Categorize errors for better user experience
   */
  private categorizeError(error: any): string {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('access_denied')) {
      return 'Authentication was cancelled by user';
    }
    if (message.includes('invalid_grant') || message.includes('authorization code')) {
      return 'Authentication session expired. Please try again';
    }
    if (message.includes('network') || message.includes('timeout')) {
      return 'Network connection issue. Please check your internet and try again';
    }
    if (message.includes('email not verified')) {
      return 'Please verify your email address with Google first';
    }
    if (message.includes('scope')) {
      return 'Required permissions not granted. Please allow email and profile access';
    }
    
    return 'Authentication failed. Please try again';
  }

  /**
   * Revoke user's Google tokens
   */
  async revokeTokens(accessToken: string): Promise<boolean> {
    try {
      await this.oauth2Client.revokeToken(accessToken);
      return true;
    } catch (error) {
      logging.error('Token revocation error:', error);
      return false;
    }
  }
}
