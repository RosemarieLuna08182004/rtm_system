import { API, ReduxChannel } from "@/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";
import { Error, ErrorTitle } from "@/shared";
import { Alert } from "react-native";

export const fetchChapterThunk = createAsyncThunk(
  ReduxChannel.CHAPTER_GET,
  async ({ UserId, chapterId, axios }: { UserId:number, chapterId:number, axios: AxiosInstance }, { rejectWithValue }) => {
    try {
      if (UserId && UserId && axios){
        const response = await axios.get(`${API}/user/term/get-chapter/${chapterId}/${UserId}`);
        return response.data.data[0];
      }
    } catch (error: any) {
      //Alert.alert(ErrorTitle.m0002,'An error occured, fetching a chapter, please try again later.');
      return rejectWithValue(error.response?.data || Error.m0011);
    }
  }
);