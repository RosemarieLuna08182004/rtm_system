import { useState, useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { RouteChannel, TermTable, ToastType } from "../../../types";
import { BASE_URL, Success } from "../../../shared";
import { displayToast } from "../../../utils";
import { useNavigate } from "react-router-dom";

export const useAddTerm = () => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate()

    const add = useCallback(async (data: TermTable) => {
        if (!data) return;
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/term/add`, data);
            setRecords(response.data.data || true);
            displayToast(Success.m00009, ToastType.success); 
            navigate(RouteChannel.TERM)
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
