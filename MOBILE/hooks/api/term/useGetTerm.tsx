import { API } from "@/constants";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { Error, ErrorTitle, TermTableInitial } from "@/shared";
import { TermTable } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useGetTerm = (TermId:number, UserId:number) => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<TermTable>(TermTableInitial);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API}/user/term/get-term/${TermId}/${UserId}`);
            setRecords(response.data.data[0]);
        } catch (error: any) {
            setRecords(TermTableInitial);
            Alert.alert(ErrorTitle.m0001, Error.m0001)
        } finally {
            setLoading(false);
        }
    }, [axios]);

    useEffect(() => {
        if (UserId !== 0 && TermId !== 0) fetchData();
    }, [TermId, UserId, fetchData]);

    return {
        records,
        loading,
        refetch: fetchData,
    };
};
