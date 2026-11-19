import { API } from "@/constants";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { ChapterTableInitial, Error, ErrorTitle } from "@/shared";
import { ChapterTable } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useGetVolume = (ChapterId:number, UserId:number) => {
    const axios = useAxiosPrivate();
    const [records, setRecords] = useState<ChapterTable>(ChapterTableInitial);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API}/user/term/get-chapter/${ChapterId}/${UserId}`);
            setRecords(response.data.data[0]);
        } catch (error: any) {
            setRecords(ChapterTableInitial);
            Alert.alert(ErrorTitle.m0001, Error.m0001)
        } finally {
            setLoading(false);
        }
    }, [axios]);

    useEffect(() => {
       if (ChapterId !== 0 && UserId !== 0) fetchData();
    }, [UserId, ChapterId, axios]);

    return {
        records,
        loading,
        refetch: fetchData,
    };
};
