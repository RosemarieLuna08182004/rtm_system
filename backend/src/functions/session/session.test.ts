import { sign } from 'jsonwebtoken';
import { readSession } from '.';
import { SECRET_KEY, SECRET_REFRESH_KEY, SESSION_MAX_DAYS } from '../../config';

const DAY = 24 * 60 * 60;
const now = Math.floor(Date.now() / 1000);

describe('readSession', () => {
  it('accepts a valid refresh token (web admin)', () => {
    const refresh = sign({ UserId: 16, LoginAt: now - DAY }, SECRET_REFRESH_KEY, { expiresIn: '7d' });
    expect(readSession(refresh, undefined)).toEqual({ claims: { UserId: 16, LoginAt: now - DAY } });
  });

  it('accepts an expired access token from the mobile app within the session limit', () => {
    const expired = sign({ Id: 43, LoginAt: now - 3 * DAY, exp: now - DAY }, SECRET_KEY);
    expect(readSession(undefined, expired)).toEqual({ claims: { UserId: 43, LoginAt: now - 3 * DAY } });
  });

  it('refuses once the original login is older than the session limit', () => {
    const old = sign({ Id: 43, LoginAt: now - (SESSION_MAX_DAYS + 1) * DAY }, SECRET_KEY);
    expect(readSession(undefined, old)).toEqual({ reason: 'expired' });
  });

  it('uses the issue time for tokens made before LoginAt existed', () => {
    const legacy = sign({ Id: 43, iat: now - (SESSION_MAX_DAYS + 2) * DAY }, SECRET_KEY);
    expect(readSession(undefined, legacy)).toEqual({ reason: 'expired' });
  });

  it('refuses tokens signed with another key', () => {
    expect(readSession(sign({ UserId: 16 }, 'not-the-secret'), sign({ Id: 16 }, 'not-the-secret'))).toEqual({ reason: 'invalid' });
  });

  it('refuses an access token passed as a refresh token (different keys)', () => {
    const access = sign({ Id: 16, LoginAt: now }, SECRET_KEY);
    expect(readSession(access, undefined)).toEqual({ reason: 'invalid' });
  });

  it('falls back to the access token when the refresh token is bad', () => {
    const access = sign({ Id: 16, LoginAt: now }, SECRET_KEY);
    expect(readSession('garbage', access)).toEqual({ claims: { UserId: 16, LoginAt: now } });
  });

  it('refuses when nothing is sent', () => {
    expect(readSession(undefined, undefined)).toEqual({ reason: 'invalid' });
  });
});
