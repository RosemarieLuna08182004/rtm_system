import { ChapterState } from "@/types";
import { ChapterTable } from "@/types/tables";

export const ChapterTableInitial: ChapterTable = {
    Title: ""
}

export const chapterInitial: ChapterState = {
    chapters: [],
    status: 'idle',
    error: null,
    chapter: ChapterTableInitial,
    chapterState: "idle"
};

