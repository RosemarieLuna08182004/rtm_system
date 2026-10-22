import { TermLineTable, TermTable } from "../../../types";

export const termInitial : TermTable = {
    ChapterId: 0,
    Term: null,
    Focus: null,
    Definition: null,
    VoiceOver: null,
    Illustration: null
}

export const termlineInitial : TermLineTable = {
    TermId: 0,
    CategoryId: 0,
    Term: null,
    Description: null,
    Position: 0,
    IsBorderLeft: false,
    Illustration: null,
}

export type Term = typeof termInitial
export type TermLine = typeof termlineInitial