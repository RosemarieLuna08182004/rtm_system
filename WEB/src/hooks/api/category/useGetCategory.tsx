import { useState, useEffect, useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { CategoryTable, ToastType } from "../../../types";
import { BASE_URL } from "../../../shared";
import { displayToast } from "../../../utils";
import { categoryInitial } from "../../../shared";

export const useGetCategory = (Id: number = 0) => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<CategoryTable>(categoryInitial);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/category/get/${Id}`);
            setRecords(response.data.data);
        } catch (error: any) {
            setRecords(categoryInitial);
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
