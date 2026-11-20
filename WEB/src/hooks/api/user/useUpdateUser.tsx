import { useState, useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { ToastType, UserTable } from "../../../types";
import { BASE_URL, Success } from "../../../shared";
import { displayToast } from "../../../utils";

/** Fields an update may change. The server refuses anything else (e.g. AccountType). */
export type UserUpdate = Partial<Pick<UserTable, "Name" | "Email">>;

export const useUpdateUser = () => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    /** Resolves true when saved; stays on the current page. */
    const update = useCallback(async (Id: number, data: UserUpdate): Promise<boolean> => {
        if (!Id || !data) return false;
        setLoading(true);
        try {
            const response = await axios.patch(`${BASE_URL}/user/update/${Id}`, data);
            setRecords(response.data.data || true);
            displayToast(Success.m00024, ToastType.success);
            return true;
        } catch (error: any) {
            setRecords(false);
            displayToast(error?.response?.data?.message || error.message, ToastType.error);
            return false;
        } finally {
            setLoading(false);
        }
    }, [axios]);

    return {
        records,
        loading,
        update,
    };
};
