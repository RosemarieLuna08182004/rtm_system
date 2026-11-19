import { API } from "@/constants";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { Error, ErrorTitle } from "@/shared";
import { TermLineTables } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useGetAllSubTerms = (TermId:number) => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<TermLineTables>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API}/term/line/get-all/${TermId}`);
            setRecords(response.data.data);
        } catch (error: any) {
            setRecords([]);
            Alert.alert(ErrorTitle.m0001, Error.m0001)
        } finally {
            setLoading(false);
        }
    }, [axios]);

    useEffect(() => {
        if (TermId !== 0) fetchData();
    }, [TermId, fetchData]);

    return {
        records,
        loading,
        refetch: fetchData,
    };
};
