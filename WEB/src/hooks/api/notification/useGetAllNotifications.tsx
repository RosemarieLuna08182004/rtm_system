import { useState, useEffect, useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { NotificationTables, ToastType } from "../../../types";
import { displayToast } from "../../../utils";

export const useGetAllNotifications = () => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<NotificationTables>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/notification/get-all/`);
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