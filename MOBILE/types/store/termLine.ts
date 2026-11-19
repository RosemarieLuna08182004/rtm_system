import { TermLineTables, TermLineTable } from "../tables";

export interface TermLineState {
	termLines: TermLineTables;
	termLine: TermLineTable;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}
  