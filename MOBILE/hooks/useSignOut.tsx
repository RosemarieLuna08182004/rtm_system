import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { clearSecureAuth, removeItem } from '@/utils';
import { authInitial } from "@/shared";
import { clearWidget } from "@/widgets/sync";

export const useSignOut = () => {
    const { setAuth } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    // Clears tokens (secure storage), saved profile data and in-memory session.
    // BookmarkProvider resets itself when the session ends; RequireAuth handles navigation.
    const signOut = useCallback(async () => {
        setLoading(true);
        try {
            await clearSecureAuth();
            await Promise.all(["auth", "token", "user"].map((key) => removeItem(key)));
            // The home-screen widget shows this account's terms, so empty it too.
            await clearWidget();
        } catch (error: any) {
            console.error('Sign out error:', error);
        } finally {
            setAuth(authInitial);
            setLoading(false);
        }
    }, [setAuth]);

    return { signOut, loading };
};
