import { useState, useEffect, useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { TermLineTable, ToastType } from "../../../types";
import { BASE_URL, termlineInitial } from "../../../shared";
import { displayToast } from "../../../utils";

export const useGetTermLine = (Id: number = 0) => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<TermLineTable>(termlineInitial);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/term/line/get/${Id}`);
            setRecords(response.data.data);
        } catch (error: any) {
            setRecords(termlineInitial);
            displayToast(error?.response?.data?.message || error.message, ToastType.error);
        } finally {
            setLoading(false);
        }
    }, [Id, axios]);

    useEffect(() => {
        if (Id !== 0) {
          fetchData();
        }
    }, [Id, fetchData]);
    
    return {
        records,
        loading,
        refetch: fetchData,
    };
};
