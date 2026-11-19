import { API, ReduxChannel } from "@/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { Error, ErrorTitle } from "@/shared";
import { Alert } from "react-native";

export const fetchTermsByChapterThunk = createAsyncThunk (
    ReduxChannel.TERM_GET_ALL,
    async ({ UserId, chapterId, axios}: { UserId:number, chapterId: number; axios: AxiosInstance }, { rejectWithValue }) => {
        try {
            if (UserId && chapterId && axios) {
                const response = await axios.get(`${API}/user/term/get-all-terms-by-chapter/${chapterId}/${UserId}`);
                return response.data.data;
            }
        } catch (error:any) {
            //Alert.alert(ErrorTitle.m0002, 'An error occured, fetching terms, please try again later.')
            return rejectWithValue(error.response?.data || Error.m0012);
        }
    }
)

