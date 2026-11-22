import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { twMerge } from "tailwind-merge";
import { RouteChannel, SFC } from "../../types";
import * as S from '../../styles'
import { useGetAllTermByChapter, useGetCategory, useGetChapter, useGetTerm, useGetTermLine } from "../../hooks";
import { TermCard, SubTermCard, SectionHeader } from "..";
import { Skeleton } from "../Skeleton";

/**
 * Read-only previews shown by default on the detail pages; Edit switches to the form.
 * Each one loads its record when shown, so returning from Edit shows what was saved.
 */

const detailRoute = (route: RouteChannel, id: string | number) => route.replace(':Id', String(id));
const hasText = (html?: string | null) => !!(html ?? '').replace(/<[^>]*>|&nbsp;/g, '').trim();

/** Same white card as the term preview */
const CARD = "bg-white md:w-4/12 w-full flex flex-col rounded-lg justify-start p-3 md:h-fit";

/** Category heading as it appears in the term preview */
const CategoryHeading = ({ children }: { children: React.ReactNode }) => (
    <S.Span className="text-sm uppercase text-primary font-bold">{children}</S.Span>
);

/** The whole term as learners see it: illustration and sub terms by category. */
export const TermPreview: SFC<{ TermId: number }> = ({ ClassName, TermId }) => {
    const { records, loading, refetch } = useGetTerm(TermId);
    // Placeholder only until this term first arrives. Hiding the card on later reloads made it
    // mount again, and TermCard reloads the term when it mounts: an endless loading loop.
    if (loading && Number(records?.Id) !== TermId) return <Skeleton ClassName="py-8 w-full" />;
    return (
        <TermCard ClassName={ClassName} Illustration={records.Illustration ?? ""} Refetch={refetch}
            ChapterTitle={records.ChapterTitle ?? ''} TermId={TermId} TermTitle={records.Term ?? ""} Definition={records.Definition ?? ""} Focus={records.Focus ?? ""} />
    );
};

/** One sub term in its category style, with the term it belongs to. */
export const SubTermPreview: SFC<{ Id: number }> = ({ ClassName, Id }) => {
    const navigate = useNavigate();
    const { records: sub, loading, refetch } = useGetTermLine(Id);
    if (loading) return <Skeleton ClassName="py-8 w-full" />;
    const hasContent = !!sub.Term || hasText(sub.Description) || !!sub.Illustration;
    return (
        <S.Container className={twMerge(CARD, ClassName)}>
            <S.Content className="mb-5 flex flex-col">
                <S.Span className="text-sm text-slate-800">Sub term of</S.Span>
                <button type="button" onClick={() => navigate(detailRoute(RouteChannel.TERM_DETAILS, sub.TermId))} title="Open this term"
                    className="txt-md text-primary font-bold text-left bg-transparent border-0 p-0 cursor-pointer hover:underline">
                    {sub.TermName?.trim() || 'Unknown term'}
                </button>
                <S.Span className="text-xs text-slate-500 mt-0.5">Position {sub.Position ?? '–'}</S.Span>
            </S.Content>
            <S.Divider className="w-full mb-2"><CategoryHeading>{sub.Category ?? 'NA'}</CategoryHeading></S.Divider>
            {hasContent ? (
                <SubTermCard Id={Number(sub.Id)} Term={sub.Term ?? ''} Description={sub.Description ?? ''} Category={sub.Category}
                    IsBorderLeft={!!sub.IsBorderLeft} Illustration={sub.Illustration} refetch={refetch} ShowOptions={false} />
            ) : (
                <S.Span className="text-sm italic text-slate-400 py-2">This sub term has no title or content yet. Click Edit to add it.</S.Span>
            )}
        </S.Container>
    );
};

/** A sub term category: its meaning, how often it's used, and how it looks in term previews. */
export const CategoryPreview: SFC<{ Id: number }> = ({ ClassName, Id }) => {
    const { records: category, loading } = useGetCategory(Id);
    if (loading) return <Skeleton ClassName="py-8 w-full" />;
    const used = Number(category.SubTermCount ?? 0);
    return (
        <S.Container className={twMerge(CARD, ClassName)}>
            <S.Content className="mb-4 flex flex-col">
                <S.Span className="text-sm text-slate-800">Sub term category</S.Span>
                <S.Span className="txt-md text-primary font-bold">{category.Category}</S.Span>
            </S.Content>
            {category.Description?.trim()
                ? <S.Span className="text-sm text-slate-700 rounded-lg bg-blue-50 p-3 mb-4">{category.Description}</S.Span>
                : <S.Span className="text-sm italic text-slate-400 mb-4">No description yet. Click Edit to add one.</S.Span>}
            <S.Span className="self-start text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-primary mb-4">
                {used === 0 ? 'Not used by any sub term yet' : `Used by ${used.toLocaleString()} sub term${used === 1 ? '' : 's'}`}
            </S.Span>
            <S.Span className="text-xs text-slate-500 mb-1">In term previews it appears as:</S.Span>
            <S.Divider className="w-full rounded-lg border border-dashed border-slate-200 p-3"><CategoryHeading>{category.Category}</CategoryHeading></S.Divider>
        </S.Container>
    );
};

/** A volume and its terms as cards; click one to open it. */
export const VolumePreview: SFC<{ Id: number }> = ({ ClassName, Id }) => {
    const navigate = useNavigate();
    const { records: volume, loading: volumeLoading } = useGetChapter(Id);
    const { records: terms, loading: termsLoading } = useGetAllTermByChapter(Id);
    const [filter, setFilter] = useState('');

    const shown = useMemo(() => {
        const query = filter.trim().toLowerCase();
        return [...(terms ?? [])]
            .filter(t => !query || `${t.Term ?? ''} ${t.Focus ?? ''}`.toLowerCase().includes(query))
            .sort((a, b) => (a.Term ?? '').trim().localeCompare((b.Term ?? '').trim()));
    }, [terms, filter]);

    if (volumeLoading) return <Skeleton ClassName="py-8 w-full" />;
    const count = terms?.length ?? 0;
    return (
        <S.Container className={twMerge("w-full bg-white rounded-lg p-3", ClassName)}>
            <S.Divider className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-2 mb-2">
                <SectionHeader Title={volume.Title || 'Untitled volume'} Description="The terms learners study in this volume. Click one to open it."
                    Badge={termsLoading ? undefined : `${count.toLocaleString()} term${count === 1 ? '' : 's'}`} />
                <TextField size="small" placeholder="Find a term in this volume" value={filter} onChange={e => setFilter(e.target.value)}
                    sx={{ width: { xs: '100%', md: '320px' } }} inputProps={{ 'aria-label': 'Find a term in this volume' }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
            </S.Divider>
            {termsLoading ? <Skeleton ClassName="py-8" /> : shown.length === 0 ? (
                <S.Span className="block text-sm text-slate-400 text-center py-10">
                    {count === 0 ? 'No terms in this volume yet.' : `No terms match "${filter.trim()}".`}
                </S.Span>
            ) : (
                <S.Divider className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {shown.map(term => (
                        <button key={term.Id} type="button" onClick={() => navigate(detailRoute(RouteChannel.TERM_DETAILS, term.Id ?? ''))}
                            className="flex flex-col text-left rounded-lg bg-blue-50 hover:bg-blue-100 border-0 p-3 cursor-pointer min-w-0 transition-colors">
                            <S.Span className="text-sm font-semibold text-slate-700 truncate">{term.Term?.trim() || '(untitled term)'}</S.Span>
                            {term.Focus?.trim() && <S.Span className="text-xs text-slate-500 truncate">Focus: {term.Focus.trim()}</S.Span>}
                        </button>
                    ))}
                </S.Divider>
            )}
        </S.Container>
    );
};
