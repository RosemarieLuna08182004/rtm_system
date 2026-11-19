import { Error, Success } from "../../../shared";
import { SECRET_KEY, TOKEN_EXPIRATION } from "../../../config";
import { sign } from "jsonwebtoken";
import { ModelResponse } from "../../../types";

/**
 * @param Id User id
 * @param LoginAt When the user originally logged in (seconds since epoch); carried
 *   through refreshes so a session can't be renewed past SESSION_MAX_DAYS
 */
export const accessToken = async (Id: number = 0, LoginAt: number = Math.floor(Date.now() / 1000)): Promise<ModelResponse> => {
    try {
        if (!Id || typeof Id !== 'number' || isNaN(Id)) return { data:null, message: Error.m012 }
        if (!SECRET_KEY) return { data:null, message: Error.m013 }
        const token = sign({ Id, LoginAt }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION })
        if (!token) return { data:null, message: Error.m003 }
        return { data:token, message: Success.m007 }
    } catch (error: any ) {
        logging.log("----------------------------------------");
        logging.error("Generate-Fn [accessToken]:", error.message);
        logging.log("----------------------------------------");
        return { data: null, message: Error.m001 };
    }
}
