import { Error, Success } from "../../../shared";
import { REFRESH_TOKEN_EXPIRATION, SECRET_REFRESH_KEY } from "../../../config";
import { sign } from "jsonwebtoken";
import { ModelResponse } from "../../../types";

export const refreshToken = async (UserId: number = 0): Promise<ModelResponse> => {
    try {   
        if (!UserId || typeof UserId !== 'number' || isNaN(UserId)) return { data:null, message: Error.m012 }
        if (!SECRET_REFRESH_KEY) return { data:null, message: Error.m013 }
        // `type` keeps a refresh token from ever being accepted as an access token.
        const token = sign({ UserId, type: 'refresh' }, SECRET_REFRESH_KEY, { expiresIn: REFRESH_TOKEN_EXPIRATION as any }) 
        if (!token) return { data:null, message: Error.m003 }
        return { data:token, message: Success.m008 }
    } catch (error: any ) {
        logging.log("----------------------------------------");
        logging.error("Generate-Fn [accessToken]:", error.message);
        logging.log("----------------------------------------");
        return { data: null, message: Error.m001 };
    }
}