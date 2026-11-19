/**
 * Address of the backend API.
 *
 * Set VITE_API_URL to the backend's origin (no trailing slash, no /api/v1):
 *  - development: WEB/.env             e.g. VITE_API_URL=http://localhost:3500
 *  - production:  WEB/.env.production  e.g. VITE_API_URL=https://rtm-aiven-backend.onrender.com
 * Vite bakes the value into the build, so rebuild after changing it.
 * If it isn't set, a production build falls back to the Render backend.
 */
const FALLBACK_ORIGIN = import.meta.env.PROD ? 'https://rtm-aiven-backend.onrender.com' : 'http://localhost:3500';

export const API_ORIGIN = (import.meta.env.VITE_API_URL || FALLBACK_ORIGIN).trim().replace(/\/+$/, '');
export const API_VERSION = 'api/v1';
export const BASE_URL = `${API_ORIGIN}/${API_VERSION}`;
