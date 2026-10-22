import { useState, useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { TermLineTable, ToastType } from "../../../types";
import { BASE_URL, Success } from "../../../shared";
import { displayToast } from "../../../utils";

export const useAddTermLine = () => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const add = useCallback(async (data: TermLineTable) => {
        if (!data) return;
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/term/line/add`, data);
            setRecords(response.data.data || true);
            displayToast(Success.m00020, ToastType.success); 
        } catch (error: any) {
            setRecords(false);
            displayToast(error?.response?.data?.message || error.message, ToastType.error);
        } finally {
            setLoading(false);
        }
    }, [axios]);

    return {
        records,
        loading,
        add,
    };
};
