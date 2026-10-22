import { Error } from "../shared";

interface response {
    status: number
    data: any
    message: string
}

export const errorResponseHandler = (errorMessage: Error) => {
    try {
        let response: response = { status: 0, data: null, message: '' }
        switch (errorMessage) {
            case Error.m001:
            case Error.m002:
            case Error.m003:
                response = { status: 500, data: null, message: Error.m001 }
            case Error.m005:
                response = { status: 404, data: false, message: Error.m005 }
            case Error.m006:
                response = { status: 400, data: false, message: Error.m006 }
            default:
                response = { status: 505, data: null, message: Error.m001 }
        }
        return response
    } catch (error : any) {
        logging.log("----------------------------------------");
        logging.error("Utitlity-Fn [errorResponseHandler]:", error.message);
        logging.log("----------------------------------------");
        return { status: 500, data: null, message: Error.m001 }
    }
}