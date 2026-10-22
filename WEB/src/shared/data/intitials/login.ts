import { LoginTable } from "../../../types";

export const loginInitial: LoginTable = {
    Email: '',
    Password: ''
};

export type loginFormValues = typeof loginInitial;