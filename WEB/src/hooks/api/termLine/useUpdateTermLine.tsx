import { useState, useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { TermLineTable, ToastType } from "../../../types";
import { BASE_URL, Success } from "../../../shared";
import { displayToast } from "../../../utils";

export const useUpdateTermLine = () => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    
    const update = useCallback(async (Id: string, data: TermLineTable): Promise<boolean> => {
        if (!data || !Id) return false;
        setLoading(true);
        try {
            const response = await axios.patch(`${BASE_URL}/term/line/update/${Id}`, data);
            setRecords(response.data.data || true);
            displayToast(Success.m00022, ToastType.success); 
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
