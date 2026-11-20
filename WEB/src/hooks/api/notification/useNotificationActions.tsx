import { useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { ToastType } from "../../../types";
import { displayToast } from "../../../utils";

/** Fired after notifications change, so the header bell recounts right away. */
export const NOTIFICATIONS_CHANGED = 'rtm:notifications-changed';
const announceChange = () => window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));

/** Mark read, mark all read, delete. Each resolves true on success and shows a toast on failure. */
export const useNotificationActions = () => {
    const axios = useAxiosPrivate();

    const run = useCallback(async (request: () => Promise<unknown>) => {
        try {
            await request();
            announceChange();
            return true;
        } catch (error: any) {
            displayToast(error?.response?.data?.message || error.message, ToastType.error);
            return false;
        }
    }, []);

    const markRead = useCallback((Id: number | string) => run(() => axios.patch(`/notification/read/${Id}`)), [axios, run]);
    const markAllRead = useCallback(() => run(() => axios.patch(`/notification/read-all/`)), [axios, run]);
    const remove = useCallback((Id: number | string) => run(() => axios.delete(`/notification/remove/${Id}`)), [axios, run]);

    return { markRead, markAllRead, remove };
};
