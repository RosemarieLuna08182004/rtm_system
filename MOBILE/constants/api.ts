export const API_VERSION = '/api/v1';

const PRODUCTION_SERVER = 'https://rtm-aiven-backend.onrender.com';

// Which server the app talks to.
// - Default: production.
// - For local testing, set EXPO_PUBLIC_API_URL in MOBILE/.env.development.local, e.g.
//   EXPO_PUBLIC_API_URL=http://192.168.37.210:3000  (your PC's Wi-Fi IP, not "localhost").
//   Expo only loads that file for `npx expo start`, never for release builds.
// - Safety net: a release build ignores any address that is not HTTPS.
const configured = (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/+$/, '');
const usable = configured && (__DEV__ || configured.startsWith('https://'));

export const API_SERVER = usable ? configured : PRODUCTION_SERVER;
export const API = `${API_SERVER}${API_VERSION}`;
export const IS_LOCAL_API = API_SERVER !== PRODUCTION_SERVER;

if (__DEV__) {
  console.log('API URL:', API);
}
