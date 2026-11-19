import { UserTermsTables, UserTable } from "../tables";

export interface UserTermsState {
    userTerms: UserTermsTables;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface UserState {
    user: UserTable
}
