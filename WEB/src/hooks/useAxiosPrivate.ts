import { axiosPrivate } from "../shared";
import { useEffect } from "react";
import { useRefreshToken, useAuth } from ".";
import { AuthState } from "../context/AuthProvider";

export const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config: any) => {
                // Skip adding auth header for refresh token request to avoid infinite loops
                if (!config.url?.includes('/refresh') && !config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            },
            (error: any) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response: any) => response,
            async (error: any) => {
                const prevRequest = error?.config;
                
                // Only attempt to refresh token on 401 (Unauthorized) and not already tried
                if (error?.response?.status === 401 && 
                    !prevRequest?.sent && 
                    !prevRequest?.url?.includes('/refresh')) {
                    
                    prevRequest.sent = true;
                    
                    try {
                        const newAccessToken = await refresh();
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    } catch (refreshError) {
                        // If refresh fails, clear auth state and redirect to login
                        console.error("Session expired. Please log in again.");
                        setAuth({} as AuthState);
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }
                
                // For other errors or repeated 401s, just reject
                return Promise.reject(error);
            }
        );
        
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, refresh, setAuth]);

    return axiosPrivate;
}