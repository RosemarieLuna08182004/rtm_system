import { API, ReduxChannel } from "@/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { Error, ErrorTitle } from "@/shared";
import { Alert } from "react-native";

export const fetchChaptersThunk = createAsyncThunk(
  ReduxChannel.CHAPTER_GET_ALL,
  async ({ UserId, axios }: { UserId:number, axios: AxiosInstance }, { rejectWithValue }) => {
    try {
      if (UserId && axios) {
        const response = await axios.get(`${API}/user/term/get-all-chapters/${UserId}`);
        return response.data.data;
      }
    } catch (error: any) {
      //Alert.alert(ErrorTitle.m0002, 'An error occured, fetching chapters, please try again later.');
      return rejectWithValue(error.response?.data || Error.m0011);
    }
  }
);