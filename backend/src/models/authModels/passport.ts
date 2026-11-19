import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GOOGLE_CALLBACK_URL } from "../../constants";
import { DBFields, DBTable, UserQuery } from "../../shared";
import { AddService, GetService, UpdateService } from "../../services";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { getByEmail } from "../../functions";
import NotificationModel from "../setupModels/notificationModels";

// Verify required environment variables
// if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
//  throw new Error('Missing Google OAuth configuration. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
//}

// Log the callback URL being used
console.log('Google OAuth Callback URL:', GOOGLE_CALLBACK_URL);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      proxy: true // Important for proxies like Heroku, Render, etc.
    },
    async function (req, accessToken, refreshToken, profile, done) {
      try {
        console.log('Google OAuth profile received for Google id:', profile.id); // not the full profile: it holds personal data
        
        const email = profile.emails && profile.emails[0]?.value;
        if (!email) {
          console.error('No email found in Google profile');
          return done(new Error('No email found in Google profile'), undefined);
        }

        const displayName = profile.displayName || '';
        const avatar = profile.photos?.[0]?.value || '';
        const googleId = profile.id;
        
        console.log(`Processing Google OAuth for email: ${email}`);
        
        // Find existing user or create new one
        const [existingUser] = await GetService.byFields(
          UserQuery.q0013,
          ['Email'],
          [String],
          [email]
        );

        const Fields = [...DBFields.t007f, 'AccessToken'];
        const Types = [String, String, String, String, String, String, Date, Date, String];
        // Google accounts sign in through Google; a random, never-shown password
        // means nobody can log in to them with email + password.
        const Password = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
        
        const userData = {
          accountType: 'user',
          googleId,
          name: displayName,
          email,
          password: Password,
          avatar,
          dateCreated: new Date(),
          dateUpdated: new Date(),
          accessToken: accessToken
        };
        
        const Datas = Object.values(userData);
        
        if (!existingUser || existingUser.length === 0) {
          console.log('Creating new user with email:', email);
          await AddService.record(DBTable.t007, Fields, Types, Datas);
          await NotificationModel.addNewUser(email, displayName, "Google"); // never throws
        } else {
          console.log('Updating existing user with email:', email);
          await UpdateService.record(
            existingUser.Id,
            DBTable.t007,
            ['AccessToken', 'DateUpdated'],
            [String, Date],
            [accessToken, new Date()]
          );
        }
        
        const finalUser = await getByEmail(email);
        if (!finalUser || !finalUser.data) {
          throw new Error('Failed to retrieve user after creation/update');
        }
        
        const userWithTokens = { 
          ...finalUser.data, 
          RefreshToken: refreshToken || 'no-refresh-token' 
        };
        
        console.log('Authentication successful for user:', email);
        return done(null, userWithTokens);
        
      } catch (error) {
        console.error('Error in Google OAuth strategy:', error);
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  //console.log("Serializing user:", user);
  done(null, user);
});

passport.deserializeUser(function (user:any, done) {
  //console.log("Deserializing user:", user);
  done(null, user);
});