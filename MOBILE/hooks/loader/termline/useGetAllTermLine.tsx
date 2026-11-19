import { API, ReduxChannel } from "@/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { Error, ErrorTitle } from "@/shared";
import { Alert } from "react-native";

export const fetchTermLinesThunk = createAsyncThunk (
    ReduxChannel.TERM_LINE_GET_ALL,
    async ({ termId, axios}: { termId: number; axios: AxiosInstance }, { rejectWithValue }) => {
        try {
            if (termId && axios) {
                const response = await axios.get(`${API}/term/line/get-all/${termId}`);
                return response.data.data;
            }
        } catch (error) {
            //Alert.alert(ErrorTitle.m0002, error?.response?.data?.message || 'An error occured, fetching sub terms, please try again later.')
            return rejectWithValue(error.response?.data || Error.m0015);
        }
    }
)