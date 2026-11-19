import { axiosPrivate } from '@/utils'
import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useRefreshToken } from "./useRefreshToken";
import { useSignOut } from "./useSignOut";
import { isGoogleAccessTokenExpired, useRefreshGoogleToken } from "./useGoogleRefreshToken";
import { isTokenExpired } from '../context/AuthProvider';

export const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth, setAuth, setAccessToken, persist } = useAuth();
    const { signOut } = useSignOut();

    const newAccessToken = async (config: any) => {
        try {
            const newToken = await refresh();
            setAccessToken(newToken);
            config.headers['Authorization'] = `Bearer ${newToken}`;
            setAuth((prevAuth: any) => ({ ...prevAuth, accessToken: newToken }));
            return newToken;
        } catch (error) {
            // Only sign out if it's a definitive auth failure, not network issues
            if (error.response?.status === 401 || error.response?.status === 403) {
                signOut();
            }
            throw error;
        }
    };

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            async (config: any) => {
                if (config.url?.includes('/auth/refresh')) {
                    return config;
                }

                if (auth?.googleProvider === 'google') {
                    const isExpired = await isGoogleAccessTokenExpired(auth?.accessToken);
                    if (isExpired) {
                        const newGoogleAccessToken = await useRefreshGoogleToken(auth?.refreshToken, auth?.user?.Id);
                        if (newGoogleAccessToken) {
                            config.headers['Authorization'] = `Bearer ${newGoogleAccessToken}`;
                            setAuth((prevAuth: any) => ({ ...prevAuth, accessToken: newGoogleAccessToken }));
                        } else {
                            // Only sign out for definitive auth failures
                            console.warn('Failed to refresh Google token, but not signing out automatically');
                            return Promise.reject(new Error('Failed to refresh Google token'));
                        }
                    } else {
                        config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                    }
                    config.headers['X-Auth-Provider'] = 'google';
                    return config;
                }

                if (auth?.accessToken) {
                    if (isTokenExpired(auth.accessToken)) {
                        try {
                            await newAccessToken(config);
                        } catch (error) {
                            return Promise.reject(error);
                        }
                    } else {
                        config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
                    }
                }
                
                config.headers['Cache-Control'] = 'no-cache';
                config.headers['Pragma'] = 'no-cache';
                config.headers['Expires'] = '0';
                
                return config;
            },
            (error: any) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response: any) => response,
            async (error: any) => {
                const originalRequest = error?.config;
                
                if (error.response?.status !== 401 && error.response?.status !== 403 || 
                    originalRequest._retry || 
                    originalRequest.url?.includes('/auth/refresh')) {
                    return Promise.reject(error);
                }

                originalRequest._retry = true;

                try {
                    const newToken = await refresh();
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return axiosPrivate(originalRequest);
                } catch (refreshError) {
                    // Only sign out for definitive auth failures, not network issues
                    if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
                        signOut();
                    }
                    return Promise.reject(refreshError);
                }
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, persist]);

    return axiosPrivate;
};