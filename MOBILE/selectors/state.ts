import { RootState } from "@/stored";

//SYSTEM
export const getManager = (state:RootState) => state.systems.manager
export const getInternal = (state:RootState) => state.systems.internal

//APP
export const getTerms = (state:RootState) => state.terms
export const getTermDetails = (state:RootState) => state.terms.term
export const getTermLines = (state:RootState) => state.termLine
export const getTermLineDetails = (state:RootState) => state.termLine.termLine
export const getChapters = (state:RootState) => state.chapter
export const getChapterDetails = (state:RootState) => state.chapter.chapter
export const getBookmarks = (state:RootState) => state.bookmarks
