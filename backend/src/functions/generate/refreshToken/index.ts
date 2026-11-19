import { Error, Success } from "../../../shared";
import { SECRET_REFRESH_KEY } from "../../../config";
import { sign } from "jsonwebtoken";
import { ModelResponse } from "../../../types";

/**
 * @param UserId User id
 * @param LoginAt When the user originally logged in (seconds since epoch), see accessToken
 */
export const refreshToken = async (UserId: number = 0, LoginAt: number = Math.floor(Date.now() / 1000)): Promise<ModelResponse> => {
    try {
        if (!UserId || typeof UserId !== 'number' || isNaN(UserId)) return { data:null, message: Error.m012 }
        if (!SECRET_REFRESH_KEY) return { data:null, message: Error.m013 }
        const token = sign({ UserId, LoginAt }, SECRET_REFRESH_KEY, { expiresIn: '7d' })
        if (!token) return { data:null, message: Error.m003 }
        return { data:token, message: Success.m008 }
    } catch (error: any ) {
        logging.log("----------------------------------------");
        logging.error("Generate-Fn [refreshToken]:", error.message);
        logging.log("----------------------------------------");
        return { data: null, message: Error.m001 };
    }
}
