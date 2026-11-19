import { API } from "@/constants";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { Error, ErrorTitle } from "@/shared";
import { TermTables } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useGetAllTerms = (ChapterId:number, UserId:number) => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<TermTables>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        if (ChapterId === 0 || UserId === 0) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.get(`${API}/user/term/get-all-terms-by-chapter/${ChapterId}/${UserId}`);
            
            const sortedData = [...response.data.data].sort((a, b) => {
                const aTerm = (a?.Term || '').toString().trim().toLowerCase();
                const bTerm = (b?.Term || '').toString().trim().toLowerCase();
                
                return aTerm.localeCompare(bTerm, undefined, {
                    sensitivity: 'base',
                    numeric: true,
                    ignorePunctuation: true
                });
            });
            
            setRecords(sortedData);
        } catch (error: any) {
            setRecords([]);
            Alert.alert(ErrorTitle.m0001, Error.m0001)
        } finally {
            setLoading(false);
        }
    }, [axios, ChapterId, UserId]);

    useEffect(() => {
        fetchData();
    }, [ChapterId, UserId, axios]);

    return {
        records,
        loading,
        refetch: fetchData,
    };
};
