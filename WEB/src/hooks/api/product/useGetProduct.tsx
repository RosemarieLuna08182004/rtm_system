import { useState, useEffect, useCallback } from "react";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { ProductTable, ToastType } from "../../../types";
import { BASE_URL, productInitial } from "../../../shared";
import { displayToast } from "../../../utils";

export const useGetProduct = (Id: number = 0) => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<ProductTable>(productInitial);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/product/get/${Id}`);
            setRecords(response.data.data);
        } catch (error: any) {
            setRecords(productInitial);
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
