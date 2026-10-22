import axios from 'axios';
import { useAuth } from './useAuth';
import { AuthState } from '../context/AuthProvider';
import { BASE_URL } from '../shared';

export const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async (): Promise<string> => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/refresh`, {
                withCredentials: true,
                timeout: 5000, // 5 second timeout
                headers: {
                    'Refresh-Token': auth?.refreshToken
                }
            });

            if (!response.data?.data?.accessToken) {
                throw new Error('No access token in response');
            }

            const newAuth: Partial<AuthState> = {
                roles: response.data.data.roles, 
                accessToken: response.data.data.accessToken,
                refreshToken: response.data.data.refreshToken || auth?.refreshToken
            };
            
            setAuth((prev: AuthState) => ({
                ...prev,
                ...newAuth
            }));

            return response.data.data.accessToken;
        } catch (error) {
            console.error("Error refreshing token:", error);
            // Clear auth state on any error during refresh
            setAuth({} as AuthState);
            throw error; // Re-throw to be handled by the interceptor
        }
    };

    return refresh;
};
