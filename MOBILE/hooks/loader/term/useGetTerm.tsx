import { API, ReduxChannel } from "@/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { Error, ErrorTitle } from "@/shared";
import { Alert } from "react-native";

export const fetchTermThunk = createAsyncThunk (
    ReduxChannel.TERM_GET,
    async ({ UserId, termId, axios}: { UserId: number, termId: number; axios: AxiosInstance }, { rejectWithValue }) => {
        try {
            if (UserId && termId && axios){
                const response = await axios.get(`${API}/user/term/get-term/${termId}/${UserId}`);
                return response.data.data[0];
            }
        } catch (error:any) {
            //Alert.alert(ErrorTitle.m0002, 'An error occured, fetching a term, please try again later.')
            return rejectWithValue(error.response?.data || Error.m0012);
        }
    }
)

