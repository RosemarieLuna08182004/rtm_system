import { useState, useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { ToastType } from "../../../types";
import { BASE_URL } from "../../../shared";
import { displayToast } from "../../../utils";

/** Changes the logged-in user's own password. The server checks the current password first. */
export const useChangePassword = () => {
    const axios = useAxiosPrivate();
    const [loading, setLoading] = useState<boolean>(false);

    const changePassword = useCallback(async (CurrentPassword: string, NewPassword: string): Promise<boolean> => {
        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/auth/change-password`, { CurrentPassword, NewPassword });
            displayToast("Password changed", ToastType.success);
            return true;
        } catch (error: any) {
            displayToast(error?.response?.data?.message || error.message, ToastType.error);
            return false;
        } finally {
            setLoading(false);
        }
    }, [axios]);

    return { loading, changePassword };
};
