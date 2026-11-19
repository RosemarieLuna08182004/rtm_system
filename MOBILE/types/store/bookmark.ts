import { TermTables } from "../tables";

export interface BookmarksState {
  bookmarks: TermTables;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}