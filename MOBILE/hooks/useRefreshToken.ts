import { refreshAccessToken } from "@/utils";

// Kept for existing callers: refreshes through the shared single-flight client.
export const useRefreshToken = () => refreshAccessToken;
