import { API } from "@/constants";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { Error, ErrorTitle } from "@/shared";
import { TermTables } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseGetAllBookmarkProps {
    UserId: number;
    ChapterId?: number; // Make ChapterId optional with a default value
}

export const useGetAllBookmark = ({ UserId, ChapterId = 0 }: UseGetAllBookmarkProps) => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<TermTables>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        if (!UserId) {
            setRecords([]);
            return;
        }
        
        setLoading(true);
        try {
            // If ChapterId is provided, use the specific chapter endpoint
            // Otherwise, use the endpoint that gets all bookmarks across chapters
            const endpoint = ChapterId 
                ? `${API}/user/term/get-all-bookmark/${UserId}/${ChapterId}`
                : `${API}/user/term/get-all-bookmark-chapter/${UserId}`;
                
            const response = await axios.get(endpoint);
            
            let recordsData = response.data?.data || [];
            
            // Sort terms alphabetically by their Term property
            recordsData = [...recordsData].sort((a, b) => {
                const aTerm = (a?.Term || '').toString().trim().toLowerCase();
                const bTerm = (b?.Term || '').toString().trim().toLowerCase();
                
                return aTerm.localeCompare(bTerm, undefined, {
                    sensitivity: 'base',
                    numeric: true,
                    ignorePunctuation: true
                });
            });
            
            setRecords(recordsData);
        } catch (error: any) {
            setRecords([]);
            Alert.alert(ErrorTitle.m0001, error.response?.data?.message || Error.m0001);
        } finally {
            setLoading(false);
        }
    }, [axios, UserId, ChapterId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        records,
        loading,
        refetch: fetchData,
    };
};
