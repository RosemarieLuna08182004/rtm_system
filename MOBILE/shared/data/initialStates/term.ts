import { TermsState, TermTable } from "@/types";

export const TermTableInitial: TermTable = {
    ChapterId: 0,
    Term: "",
    Focus: "",
    Definition: ""
}

export const termInitial: TermsState = {
    terms: [],
    status: 'idle',
    error: null,
    term: TermTableInitial,
    termStatus: "idle"
};

