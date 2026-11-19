import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { useRouter } from "expo-router";
import { RoutesChannel } from "@/constants";
import { removeItem } from '@/utils';

export const useSignOut = () => {
    const { setAuth } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const signOut = useCallback(async () => {
        setLoading(true);
        try {
            // Clear auth state and storage
            await removeItem("auth");
            await removeItem("token");
            await removeItem("user");
            
            // Set auth to initial state - let RequireAuth handle navigation
            setAuth({
                accessToken: "",
                refreshToken: "",
                roles: [],
                user: null
            });
            
            // Don't manually navigate - let the auth system handle it
        } catch (error: any) {
            console.error('Sign out error:', error);
            // Still clear auth state even on error
            setAuth({
                accessToken: "",
                refreshToken: "",
                roles: [],
                user: null
            });
        } finally {
            setLoading(false);
        }
    }, [setAuth]);

    return { signOut, loading };
};