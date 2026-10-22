export const NODE_ENV = 'production' // development | production | testing;
export const API_VERSION = 'api/v1'
export const API_SERVER = NODE_ENV.includes('production')?'rtm-aiven-backend.onrender.com':'localhost'//'rtm-aiven-backend.onrender.com'
export const API_PORT = '3500'
// Local testing: set VITE_API_URL (e.g. in .env.development.local) to use a backend on this PC.
// Without it, the live server is used.
const LOCAL_API_URL = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '')
export const BASE_URL = LOCAL_API_URL
    ? `${LOCAL_API_URL}/${API_VERSION}`
    : NODE_ENV.includes('production')?`https://${API_SERVER}/${API_VERSION}`:`http://${API_SERVER}:${API_PORT}/${API_VERSION}`
