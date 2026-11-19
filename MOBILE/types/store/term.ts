import { TermTables, TermTable } from "../tables";

export interface TermsState {
    terms: TermTables;
    term: TermTable;
    termStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
