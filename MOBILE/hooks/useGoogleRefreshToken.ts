import axios from 'axios';
import { useAuth } from './useAuth';
import { API } from '@/constants';
import { axiosPrivate } from '@/utils';
import { Alert } from 'react-native';
import { Error, ErrorTitle } from '@/shared';

export const isGoogleAccessTokenExpired = async (accessToken:string):Promise<boolean> => {
  try {
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`);
    const currentTime = Math.floor(Date.now() / 1000);
    return parseInt(response.data.exp, 10) < currentTime;
  } catch (error:any) {
    return true;
  }
};

export const useRefreshGoogleToken = async (refreshToken:string, Id:number): Promise<string|null> => {
  try {
    const response = await axios.post(`${API}/auth/refresh-google/${Id}`, { refreshToken });
    return response.data.data;
  } catch (error) {
    Alert.alert(ErrorTitle.m0001, error.response?.data.message || Error.m0016)
    return null;
  }
};
