import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth, useRefreshToken } from '../../hooks/';
import { Splash } from "../../components";

export const PersistContext = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error("Error refreshing token:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        if (!auth?.accessToken && persist) verifyRefreshToken();
        else setIsLoading(false);
        
        return () => {
            isMounted = false;
        };
    }, [auth?.accessToken, persist, refresh]);

    if (isLoading) return <Splash />;

    return <Outlet />;
};
