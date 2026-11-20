import { useState, useEffect, useCallback, useRef } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { NOTIFICATIONS_CHANGED } from "./useNotificationActions";

const POLL_INTERVAL = 30000; // 30 seconds

export const useGetUnreadNotifications = () => {
    const axios = useAxiosPrivate();
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchUnread = useCallback(async () => {
        try {
            const response = await axios.get(`/notification/get-all/`);
            const all = response.data.data ?? [];
            const unread = all.filter((n: any) => n.Status === 1);
            setUnreadCount(unread.length);
        } catch {
            // silently fail — don't spam toasts for background polling
        }
    }, [axios]);

    useEffect(() => {
        fetchUnread();
        intervalRef.current = setInterval(fetchUnread, POLL_INTERVAL);
        // Recount immediately when notifications are read or deleted
        window.addEventListener(NOTIFICATIONS_CHANGED, fetchUnread);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            window.removeEventListener(NOTIFICATIONS_CHANGED, fetchUnread);
        };
    }, [fetchUnread]);

    return { unreadCount, refetch: fetchUnread };
};