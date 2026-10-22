import { Roles, UserTable } from "../../../types";


export const userInitial: UserTable = {
    AccountType: Roles.default,
    Name: "",
    Email:  "",
    GoogleId: null,
    Password: "",
    ProfilePhoto: null,
    AccessToken: null
}

export type User = typeof userInitial