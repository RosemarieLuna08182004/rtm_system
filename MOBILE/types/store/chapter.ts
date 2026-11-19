import { ChapterTable, ChapterTables } from "../tables";

export interface ChapterState {
	chapters: ChapterTables;
	chapter: ChapterTable;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	chapterState: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}
  