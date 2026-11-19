import { API } from '@/constants';
import * as AuthSession from 'expo-auth-session';
import { AuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Alert } from 'react-native';

// Complete the auth session for proper cleanup
WebBrowser.maybeCompleteAuthSession();

export interface AuthResult {
  success: boolean;
  user?: any;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export interface RefreshResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export class AuthService {
  private static instance: AuthService;
  private redirectUri: string;

  private constructor() {
    this.redirectUri = makeRedirectUri({
      scheme: 'roots-and-morphology', // Make sure this matches your app.json scheme
      path: 'auth'
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initiate Google OAuth using Expo AuthSession (recommended approach)
   */
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      console.log('Starting Google OAuth with redirect URI:', this.redirectUri);

      // Get auth URL from backend
      const authUrlResponse = await fetch(`${API}/auth/google?mobile=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'RTM-Mobile-App'
        }
      });

      if (!authUrlResponse.ok) {
        throw new Error('Failed to get authentication URL');
      }

      const { authUrl } = await authUrlResponse.json();

      // Use WebBrowser for auth session (more reliable)
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        this.redirectUri
      );

      console.log('Auth session result:', result);

      if (result.type === 'success') {
        return await this.handleAuthSuccess(result.url);
      } else if (result.type === 'cancel') {
        return {
          success: false,
          error: 'Authentication was cancelled'
        };
      } else {
        return {
          success: false,
          error: 'Authentication failed'
        };
      }

    } catch (error: any) {
      console.error('Google OAuth error:', error);
      return {
        success: false,
        error: error.message || 'Authentication failed'
      };
    }
  }

  /**
   * Alternative WebBrowser-based OAuth (fallback)
   */
  async signInWithGoogleWebBrowser(): Promise<AuthResult> {
    try {
      console.log('Starting Google OAuth with WebBrowser');

      // Get auth URL from backend
      const authUrlResponse = await fetch(`${API}/auth/google?mobile=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'RTM-Mobile-App'
        }
      });

      if (!authUrlResponse.ok) {
        throw new Error('Failed to get authentication URL');
      }

      const { authUrl } = await authUrlResponse.json();

      // Open browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        this.redirectUri,
        {
          showInRecents: true,
          createTask: false
        }
      );

      console.log('WebBrowser auth result:', result);

      if (result.type === 'success') {
        return await this.handleAuthSuccess(result.url);
      } else if (result.type === 'cancel') {
        return {
          success: false,
          error: 'Authentication was cancelled'
        };
      } else {
        return {
          success: false,
          error: 'Authentication failed'
        };
      }

    } catch (error: any) {
      console.error('Google OAuth WebBrowser error:', error);
      return {
        success: false,
        error: error.message || 'Authentication failed'
      };
    }
  }

  /**
   * Handle successful auth redirect
   */
  private async handleAuthSuccess(url: string): Promise<AuthResult> {
    try {
      // Parse the callback URL to extract the authorization code
      const urlObj = new URL(url);
      const code = urlObj.searchParams.get('code');
      const error = urlObj.searchParams.get('error');

      if (error) {
        throw new Error(`OAuth error: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      // Exchange code for tokens via backend
      const tokenResponse = await fetch(`${API}/auth/google/callback?code=${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'RTM-Mobile-App'
        }
      });

      const tokenData = await tokenResponse.json();

      if (!tokenData.success) {
        throw new Error(tokenData.error || 'Failed to exchange code for tokens');
      }

      return {
        success: true,
        user: tokenData.data.user,
        accessToken: tokenData.data.accessToken,
        refreshToken: tokenData.data.refreshToken
      };

    } catch (error: any) {
      console.error('Auth success handling error:', error);
      return {
        success: false,
        error: error.message || 'Failed to complete authentication'
      };
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string, userId: number): Promise<RefreshResult> {
    try {
      const response = await fetch(`${API}/auth/google/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken,
          userId
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to refresh token');
      }

      return {
        success: true,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken
      };

    } catch (error: any) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: error.message || 'Failed to refresh authentication'
      };
    }
  }

  /**
   * Revoke Google tokens (sign out)
   */
  async revokeTokens(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${API}/auth/google/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accessToken
        })
      });

      const data = await response.json();
      return data.success;

    } catch (error: any) {
      console.error('Token revocation error:', error);
      return false;
    }
  }

  /**
   * Show user-friendly error messages
   */
  showAuthError(error: string): void {
    let title = 'Authentication Error';
    let message = error;

    if (error.includes('cancelled')) {
      title = 'Sign In Cancelled';
      message = 'You cancelled the sign-in process. Please try again when ready.';
    } else if (error.includes('network') || error.includes('connection')) {
      title = 'Connection Error';
      message = 'Please check your internet connection and try again.';
    } else if (error.includes('expired')) {
      title = 'Session Expired';
      message = 'Your authentication session has expired. Please sign in again.';
    }

    Alert.alert(title, message, [
      { text: 'OK', style: 'default' }
    ]);
  }
}
