import { TermLineState, TermLineTable } from "@/types";

export const termLineTableInitial: TermLineTable = {
    TermId: 0,
    CategoryId: 0,
    IsBorderLeft: false,
    ChapterId: 0,
    Term: "",
    Focus: "",
    Definition: ""
}

export const termLineInitial: TermLineState = {
    termLines: [],
    status: 'idle',
    error: null,
    termLine: termLineTableInitial
};