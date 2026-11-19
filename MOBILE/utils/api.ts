import { API } from "@/constants";
import axios from "axios";

export default axios.create({
    baseURL: API
});

export const axiosPrivate = axios.create({
    baseURL: API,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});