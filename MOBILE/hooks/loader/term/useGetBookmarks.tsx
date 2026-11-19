import { API, ReduxChannel } from "@/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { Error, ErrorTitle } from "@/shared";

export interface GetBookmarksParams {
    UserId: number;
    ChapterId: number;
    axios: AxiosInstance;
}

export const fetchBookmarksThunk = createAsyncThunk (
    ReduxChannel.TERM_GET_ALL_BOOKMARK,
    async ({ UserId, ChapterId, axios }: GetBookmarksParams, { rejectWithValue }) => {
        try {
            if (UserId && ChapterId && axios) {
                const response = await axios.get(
                    `${API}/user/term/get-all-bookmark/${UserId}/${ChapterId}`
                );
                return response.data.data;
            }
            return rejectWithValue(Error.m0013); // Missing required parameters
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || Error.m0013);
        }
    }
)