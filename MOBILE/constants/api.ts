import { NodeEnvironment } from "@/types/tables"

export const NODE_ENV = NodeEnvironment.PRODUCTION;

export const API_PORT = '3000';
export const API_VERSION = '/api/v1';

const isDevelopment = false;

console.log('Current environment:', NODE_ENV);

export const API_SERVER = isDevelopment 
  ? 'localhost'
  : 'rtm-aiven-backend.onrender.com';

export const API = isDevelopment 
  ? `http://${API_SERVER}:${API_PORT}${API_VERSION}`
  : `https://${API_SERVER}${API_VERSION}`;

if (isDevelopment) {
  console.log('API URL:', API);
}
