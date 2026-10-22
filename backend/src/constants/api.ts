import { server, NODE_ENV } from "../config";

export const API = "/api/v1"; // api versioning
export const URL =
  NODE_ENV === "production"
    ? "https://rtm-aiven-backend.onrender.com"
    : `http://${server.SERVER_HOSTNAME}:${server.SERVER_PORT}`;
