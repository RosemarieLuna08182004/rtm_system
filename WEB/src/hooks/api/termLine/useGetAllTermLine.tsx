import { useState, useEffect, useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { TermLineTables, ToastType } from "../../../types";
import { BASE_URL } from "../../../shared";
import { displayToast } from "../../../utils";

export const useGetAllTermLine = () => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<TermLineTables>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/term/line/get-all/`);
            setRecords(response.data.data);
        } catch (error: any) {
            setRecords([]);
            displayToast(error?.response?.data?.message || error.message, ToastType.error);
        } finally {
            setLoading(false);
        }
    }, [axios]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        records,
        loading,
        refetch: fetchData,
    };
};
