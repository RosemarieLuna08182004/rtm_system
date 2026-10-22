import { ToastType } from "../types";
import { displayToast } from "./toast";

export const formatDateToMMDDYY = (isoDateString: string) => {
    try {
        const date = new Date(isoDateString);
        //if (isNaN(date.getTime())) throw new Error("Invalid date");
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${month}/${day}/${year}`;
    } catch (error: any) {
        displayToast(error.message, ToastType.error)
    }
}

export const formatDate = (isoDateString: string) => {
    try {
        const date = new Date(isoDateString);
        //if (isNaN(date.getTime())) throw new Error("Invalid date");
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = String(date.getFullYear());
        const hr = String(date.getHours() + 1).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const sec = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hr}:${min}:${sec}`;
    } catch (error: any) {
        displayToast(error.message, ToastType.error)
    }
}

/*export const formatNumber = (Amount: number): string => {
    return Amount.toFixed(2); // Formats the number to 2 decimal places and returns it as a string
};*/
