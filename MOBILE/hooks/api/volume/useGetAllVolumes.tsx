import { API } from "@/constants";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { Error, ErrorTitle } from "@/shared";
import { TermTables } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useGetAllVolumes = (UserId:number) => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<TermTables>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        if (UserId === 0) return;
        
        setLoading(true);
        try {
            const response = await axios.get(`${API}/user/term/get-all-chapters/${UserId}`);
            setRecords(response.data.data || []);
            setIsInitialized(true);
        } catch (error: any) {
            setRecords([]);
            setIsInitialized(true);
            Alert.alert(ErrorTitle.m0001, Error.m0001)
        } finally {
            setLoading(false);
        }
    }, [axios, UserId]);

    useEffect(() => {
       if (UserId !== 0 && !isInitialized) {
           fetchData();
       }
    }, [UserId, fetchData, isInitialized]);

    return {
        records,
        loading,
        refetch: fetchData,
    };
};
