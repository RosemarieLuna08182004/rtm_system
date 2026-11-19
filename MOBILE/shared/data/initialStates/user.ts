import { UserState,  } from "@/types";
import { UserTable } from "@/types/tables/user";

export const userInitial: UserState = {
    user: null,
};

export const userFormInitial : UserTable = {
    AccountType: "",
    GoogleId:null,
    Name: "",
    Email: "",
    ProfilePhoto:null,
    AccessToken:null,
}