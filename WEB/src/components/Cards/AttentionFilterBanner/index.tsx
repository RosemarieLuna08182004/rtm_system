import { twMerge } from "tailwind-merge";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import type { AttentionFilter } from "../../../utils/attention";
import { SFC } from "../../../types";
import * as S from '../../../styles'

interface AttentionFilterBannerProps {
    Filter: AttentionFilter;
    /** Records currently shown (deleted ones drop out) */
    Shown: number;
    /** Plural record name, e.g. "terms" */
    Noun: string;
    OnClear: () => void;
}

/** Shown on a list page opened from a Needs Attention "View all" link. */
export const AttentionFilterBanner: SFC<AttentionFilterBannerProps> = ({ ClassName, Filter, Shown, Noun, OnClear }) => (
    <S.Divider className={twMerge("w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-3 py-2 rounded-md bg-amber-50 border border-amber-200", ClassName)}>
        <S.Divider className="flex items-start gap-2 min-w-0">
            <FilterAltOutlinedIcon fontSize="small" className="text-amber-600 shrink-0 mt-0.5" />
            <S.Divider className="flex flex-col min-w-0">
                {Filter.source === 'search' ? (<>
                    <S.Span className="text-sm text-zinc-700">
                        Showing <b>{Shown.toLocaleString()}</b> {Noun} matching <b>"{Filter.title}"</b>
                    </S.Span>
                    <S.Span className="text-xs text-slate-500">
                        Results from your Dashboard search.
                    </S.Span>
                </>) : (<>
                    <S.Span className="text-sm text-zinc-700">
                        Showing <b>{Shown.toLocaleString()}</b> {Noun} from Needs Attention: <b>{Filter.title}</b>
                    </S.Span>
                    <S.Span className="text-xs text-slate-500">
                        Records flagged when you opened this list. Fixed ones stay listed until you reopen it from the dashboard.
                    </S.Span>
                </>)}
            </S.Divider>
        </S.Divider>
        <button
            type="button"
            onClick={OnClear}
            className="self-start sm:self-center shrink-0 flex items-center gap-1 text-xs font-medium text-primary bg-white border border-slate-200 rounded-md px-2 py-1 cursor-pointer hover:bg-blue-50"
        >
            <CloseIcon style={{ fontSize: 14 }} /> Show all {Noun}
        </button>
    </S.Divider>
);
