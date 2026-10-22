import { useState, useCallback } from "react";
import { useAxiosPrivate } from "./useAxiosPrivate";
import { BASE_URL } from "../shared";
import { displayToast } from "../utils";
import { RouteChannel, ToastType } from "../types";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useSignOut = () => {
    const axios = useAxiosPrivate();
    const navigate = useNavigate();
    const {setAuth} = useAuth()

    const [records, setRecords] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    
    const signOut = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/auth/logout/`);
            setAuth({})
            navigate(RouteChannel.INDEX)
            setRecords(response.data.data);
        } catch (error: any) {
            setRecords(false);
            displayToast(error?.response?.data?.message || error.message, ToastType.error);
        } finally {
            setLoading(false);
        }
    }, [axios, setAuth, navigate]);

    return {
        records,
        loading,
        reSignOut: signOut
    };
};
