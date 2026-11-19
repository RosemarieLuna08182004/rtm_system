import { API } from "@/constants";
import { useAuth } from "./useAuth";
import { authInitial } from "@/shared";
import axios from "axios";

export const useRefreshToken = () => {
  const { auth, setAuth, persist } = useAuth();
  const refresh = async () => {
    if (!persist) {
      throw new Error("Session persistence is disabled");
    }

    try {
      const response = await axios.get(`${API}/auth/refresh`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${auth?.accessToken}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
        timeout: 10000,
      });

      if (response?.data?.data?.accessToken) {
        const newAccessToken = response.data.data.accessToken;
        setAuth((prev: any) => ({
          ...prev,
          accessToken: newAccessToken,
        }));
        return newAccessToken;
      }

      throw new Error("No access token in response");
    } catch (error) {
      // If refresh token is invalid or expired, clear auth state
      if (error.response?.status === 401 || error.response?.status === 403) {
        setAuth(authInitial);
      }

      throw error;
    }
  };

  return refresh;
};
