import { API } from "@/constants";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { isTokenExpired } from "./token";

export default axios.create({
    baseURL: API
});

export const axiosPrivate = axios.create({
    baseURL: API,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

// ---------------------------------------------------------------------------
// Session bridge: AuthProvider registers how to read and update the session, so the
// interceptors below are installed exactly once for the whole app.
// ---------------------------------------------------------------------------
export interface SessionTokens {
    accessToken: string;
    refreshToken?: string;
}

interface SessionBridge {
    getSession: () => { accessToken?: string; refreshToken?: string };
    onTokens: (tokens: SessionTokens) => void;
    onSessionExpired: () => void;
}

let bridge: SessionBridge | null = null;
export const configureSession = (next: SessionBridge | null) => { bridge = next; };

class SessionExpiredError extends Error {
    constructor() { super('Session expired'); }
}

// Single-flight: concurrent requests share one refresh call.
let refreshInFlight: Promise<string> | null = null;

const requestNewAccessToken = async (): Promise<string> => {
    const session = bridge?.getSession();
    if (!session?.refreshToken) throw new SessionExpiredError();
    const response = await axios.post(`${API}/auth/refresh`, { refreshToken: session.refreshToken }, { timeout: 10000 });
    const accessToken = response?.data?.data?.accessToken;
    if (!accessToken) throw new SessionExpiredError();
    bridge?.onTokens({ accessToken, refreshToken: response.data.data.refreshToken ?? session.refreshToken });
    return accessToken;
};

export const refreshAccessToken = (): Promise<string> => {
    if (!refreshInFlight) {
        refreshInFlight = requestNewAccessToken()
            .catch((error: any) => {
                // Only a rejected credential ends the session; network errors don't.
                const status = error?.response?.status;
                if (error instanceof SessionExpiredError || status === 401 || status === 403) bridge?.onSessionExpired();
                throw error;
            })
            .finally(() => { refreshInFlight = null; });
    }
    return refreshInFlight;
};

const isRefreshCall = (url?: string) => !!url && url.includes('/auth/refresh');

axiosPrivate.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (isRefreshCall(config.url)) return config;
    const session = bridge?.getSession();
    let accessToken = session?.accessToken;
    if (accessToken && isTokenExpired(accessToken) && session?.refreshToken) {
        accessToken = await refreshAccessToken();
    }
    if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
    return config;
});

axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original: any = error?.config;
        // 401 = token missing/expired. 403 is "not allowed" and is not retried.
        if (!original || error.response?.status !== 401 || original._retry || isRefreshCall(original.url)) {
            return Promise.reject(error);
        }
        original._retry = true;
        const accessToken = await refreshAccessToken();
        original.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosPrivate(original);
    }
);
