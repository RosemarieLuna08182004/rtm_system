import { RouteChannel, SFC } from "../../../types";
import * as S from '../../../styles/Styles'
import { AddNewDropDown, NeedsAttentionCard, SearchResultsCard, StatCard } from "../../../components";
import { AttentionIssue, getAttentionIssues, searchContent } from "../../../utils";
import { useSearch } from "../../../context";
import { mdiFormSelect, mdiTextShort, mdiCardTextOutline, mdiAccountGroupOutline, mdiBookOutline } from '@mdi/js';
import { useNavigate } from "react-router-dom";
import { useGetAllCategory, useGetAllChapter, useGetAllTerm, useGetAllTermLine, useGetAllUsers } from "../../../hooks";
import { useMemo, useEffect, useState, useCallback, useRef, useDeferredValue } from "react";
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';

// Terms + sub terms are several MB, so content refreshes every 2 minutes,
// plus right away when the admin returns to this tab (e.g. after fixing something elsewhere).
const CONTENT_POLL_INTERVAL_MS = 120_000;
const CONTENT_MIN_GAP_MS = 10_000;

const isPageVisible = () => document.visibilityState === 'visible';

export const AdminDashboardPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const { records: category, loading: categoryLoading, refetch: refetchCategory } = useGetAllCategory();
    const { records: terms, loading: termsLoading, refetch: refetchTerms } = useGetAllTerm();
    const { records: subterms, loading: subtermsLoading, refetch: refetchSubterms } = useGetAllTermLine();
    const { records: user, refetch: refetchUsers } = useGetAllUsers();
    const { records: chapter, loading: chapterLoading, refetch: refetchChapter } = useGetAllChapter();
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const contentRefreshing = useRef(false);
    const lastContentRefresh = useRef(Date.now());
    const refreshContent = useCallback(async () => {
        if (contentRefreshing.current || Date.now() - lastContentRefresh.current < CONTENT_MIN_GAP_MS) return;
        contentRefreshing.current = true;
        try {
            await Promise.all([refetchTerms(), refetchSubterms(), refetchChapter(), refetchCategory(), refetchUsers()]);
            setLastUpdated(new Date());
        } finally {
            lastContentRefresh.current = Date.now();
            contentRefreshing.current = false;
        }
    }, [refetchTerms, refetchSubterms, refetchChapter, refetchCategory, refetchUsers]);

    useEffect(() => {
        const onReturn = () => { if (isPageVisible()) refreshContent(); };
        const interval = setInterval(onReturn, CONTENT_POLL_INTERVAL_MS);
        document.addEventListener('visibilitychange', onReturn);
        window.addEventListener('focus', onReturn);
        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', onReturn);
            window.removeEventListener('focus', onReturn);
        };
    }, [refreshContent]);

    const CategoryCount = useMemo(() => category?.length ?? 0, [category]);
    const TermCount = useMemo(() => terms?.length ?? 0, [terms]);
    const SubtermCount = useMemo(() => subterms?.length ?? 0, [subterms]);
    const UserCount = useMemo(() => user?.length ?? 0, [user]);
    const VolumeCount = useMemo(() => chapter?.length ?? 0, [chapter]);

    // Needs Attention: derived from the lists above (no draft flag exists in the DB).
    // Recalculated only when no list is loading, so cross-checks never mix fresh and stale
    // lists. During a background refresh the previous result stays on screen.
    const anyListLoading = termsLoading || subtermsLoading || chapterLoading || categoryLoading;
    const [attentionIssues, setAttentionIssues] = useState<AttentionIssue[]>([]);
    const [attentionReady, setAttentionReady] = useState(false);
    useEffect(() => {
        if (anyListLoading) return;
        setAttentionIssues(getAttentionIssues({ terms: terms ?? [], subterms: subterms ?? [], chapters: chapter ?? [], categories: category ?? [] }));
        setAttentionReady(true);
    }, [anyListLoading, terms, subterms, chapter, category]);

    // Recent Activity — latest create/update across content types, newest first
    const ACTIVITY_STYLES = {
        category: { Icon: AddRoundedIcon,          badge: 'bg-green-50 text-green-500' },
        term:     { Icon: EditOutlinedIcon,         badge: 'bg-violet-50 text-violet-500' },
        subterm:  { Icon: ListAltOutlinedIcon,      badge: 'bg-blue-50 text-blue-500' },
        user:     { Icon: PersonAddAltOutlinedIcon, badge: 'bg-orange-50 text-orange-500' },
        volume:   { Icon: CloudDoneOutlinedIcon,    badge: 'bg-emerald-50 text-emerald-500' },
    } as const;

    const timeAgo = (date: Date) => {
        const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days === 1 ? '' : 's'} ago`;
    };

    const recentActivity = useMemo(() => {
        const items: { type: keyof typeof ACTIVITY_STYLES; title: string; detail: string; date: Date }[] = [];

        (category ?? []).forEach(c => c.DateCreated && items.push({
            type: 'category', title: 'Admin added a new category', detail: `"${c.Category}"`, date: new Date(c.DateCreated)
        }));
        (terms ?? []).forEach(t => {
            const updated = t.DateUpdated ?? t.DateCreated;
            if (updated) items.push({
                type: 'term', title: t.DateUpdated ? 'Term updated' : 'New term added',
                detail: `"${t.Term ?? 'Untitled term'}"`, date: new Date(updated)
            });
        });
        (subterms ?? []).forEach(s => s.DateCreated && items.push({
            type: 'subterm', title: 'New sub term added', detail: `"${s.Term}" under "${s.TermName ?? s.Category ?? 'a term'}"`, date: new Date(s.DateCreated)
        }));
        (user ?? []).forEach(u => u.DateCreated && items.push({
            type: 'user', title: 'User created', detail: u.Email, date: new Date(u.DateCreated)
        }));
        (chapter ?? []).forEach(c => {
            const updated = c.DateUpdated ?? c.DateCreated;
            if (updated) items.push({
                type: 'volume', title: c.DateUpdated ? 'Volume updated' : 'New volume added',
                detail: `"${c.Title}"`, date: new Date(updated)
            });
        });

        return items
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 5);
    }, [category, terms, subterms, user, chapter]);

    // System Activity — content counts this month
    const thisMonth = new Date();
    const isThisMonth = (date: any) => {
        const d = new Date(date);
        return d.getMonth() === thisMonth.getMonth() && d.getFullYear() === thisMonth.getFullYear();
    };
    const activityStats = useMemo(() => [
        { label: 'New Terms', count: terms?.filter(t => isThisMonth(t.DateCreated))?.length ?? 0, icon: mdiTextShort },
        { label: 'New Volumes', count: chapter?.filter(c => isThisMonth(c.DateCreated))?.length ?? 0, icon: mdiBookOutline },
        { label: 'New Categories', count: category?.filter(c => isThisMonth(c.DateCreated))?.length ?? 0, icon: mdiFormSelect },
        { label: 'New Users', count: user?.filter(u => isThisMonth(u.DateCreated))?.length ?? 0, icon: mdiAccountGroupOutline },
    ], [terms, chapter, category, user]);

    // Search box in the top bar: results come from the lists already loaded above.
    // useDeferredValue keeps typing smooth while ~13k records are filtered.
    const { searchQuery } = useSearch();
    const deferredQuery = useDeferredValue(searchQuery);
    const searching = searchQuery.trim().length > 0;
    const searchGroups = useMemo(
        () => searchContent(deferredQuery, { terms: terms ?? [], subterms: subterms ?? [], chapters: chapter ?? [], categories: category ?? [], users: user ?? [] }),
        [deferredQuery, terms, subterms, chapter, category, user]
    );

    const formattedTime = lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return (
        <>
            <S.Container className={ClassName}>
                {/* Quick-add action, right-aligned below the top bar */}
                <S.Actions className="flex justify-end w-full mb-2">
                    <AddNewDropDown />
                </S.Actions>

                {/* KPI Cards */}
                <S.CardContainer className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                    <StatCard Tone="blue"   Icons={mdiBookOutline}          Value={VolumeCount.toLocaleString()}   Title="Volumes"    OnClick={() => navigate(RouteChannel.CHAPTER)} />
                    <StatCard Tone="violet" Icons={mdiFormSelect}           Value={CategoryCount.toLocaleString()} Title="Categories" OnClick={() => navigate(RouteChannel.CATEGORY)} />
                    <StatCard Tone="teal"   Icons={mdiTextShort}            Value={TermCount.toLocaleString()}     Title="Terms"      OnClick={() => navigate(RouteChannel.TERM)} />
                    <StatCard Tone="orange" Icons={mdiCardTextOutline}      Value={SubtermCount.toLocaleString()}  Title="Sub Terms"  OnClick={() => navigate(RouteChannel.TERM_LINE)} />
                    <StatCard Tone="indigo" Icons={mdiAccountGroupOutline}  Value={UserCount.toLocaleString()}     Title="Users"      OnClick={() => navigate(RouteChannel.USER)} />
                </S.CardContainer>

                {searching ? (
                    <SearchResultsCard ClassName="mt-3" Query={deferredQuery} Groups={searchGroups} Loading={!attentionReady} />
                ) : (
                /* Left: what needs action. Right: activity snapshot and recent activity feed. */
                <S.Content className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                    <NeedsAttentionCard ClassName="lg:col-span-7" Issues={attentionIssues} Loading={!attentionReady} />

                    <S.Divider className="lg:col-span-5 min-w-0 flex flex-col gap-3">

                        {/* System Activity */}
                        <S.Divider className="w-full bg-white rounded-lg border border-slate-200/70 shadow-sm p-4">
                            <S.Divider className="flex items-center justify-between mb-3">
                                <S.Divider className="flex items-center gap-2">
                                    <InsightsIcon className="text-primary" fontSize="small" />
                                    <S.Span className="font-semibold text-zinc-700">This Month</S.Span>
                                </S.Divider>
                                <S.Span className="text-xs text-slate-400">{thisMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</S.Span>
                            </S.Divider>
                            <S.Divider className="grid grid-cols-2 2xl:grid-cols-4 gap-2">
                                {activityStats.map((stat, i) => (
                                    <S.Divider key={i} className="flex flex-col bg-blue-50 rounded-lg px-3 py-2 min-w-0">
                                        <S.Span className="text-xl font-bold text-primary leading-tight">{stat.count}</S.Span>
                                        <S.Span className="text-xs text-slate-500 truncate">{stat.label}</S.Span>
                                    </S.Divider>
                                ))}
                            </S.Divider>
                        </S.Divider>

                        {/* Recent Activity */}
                        <S.Divider className="w-full bg-white rounded-lg border border-slate-200/70 shadow-sm p-4">
                            <S.Divider className="flex items-center justify-between mb-3">
                                <S.Divider className="flex items-center gap-2">
                                    <HistoryOutlinedIcon className="text-primary" fontSize="small" />
                                    <S.Span className="font-semibold text-zinc-700">Recent Activity</S.Span>
                                </S.Divider>
                                <S.Divider className="flex items-center gap-1">
                                    <S.Divider className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <S.Span className="text-xs text-slate-400">Updated {formattedTime}</S.Span>
                                </S.Divider>
                            </S.Divider>

                            {recentActivity.length === 0 ? (
                                <S.Divider className="flex flex-col items-center justify-center py-6 text-slate-300 gap-1">
                                    <HistoryOutlinedIcon fontSize="large" />
                                    <S.Span className="text-sm">No activity recorded yet</S.Span>
                                </S.Divider>
                            ) : (
                                <S.Divider className="flex flex-col divide-y divide-slate-100">
                                    {recentActivity.map((activity, i) => {
                                        const { Icon, badge } = ACTIVITY_STYLES[activity.type];
                                        return (
                                            <S.Divider key={i} className="flex items-center justify-between gap-3 py-2">
                                                <S.Divider className="flex items-center gap-3 min-w-0">
                                                    <S.Divider className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${badge}`}>
                                                        <Icon fontSize="small" />
                                                    </S.Divider>
                                                    <S.Divider className="flex flex-col min-w-0">
                                                        <S.Span className="text-sm font-medium text-zinc-700 truncate">{activity.title}</S.Span>
                                                        <S.Span className="text-xs text-slate-400 truncate">{activity.detail}</S.Span>
                                                    </S.Divider>
                                                </S.Divider>
                                                <S.Span className="text-xs text-slate-400 shrink-0">{timeAgo(activity.date)}</S.Span>
                                            </S.Divider>
                                        );
                                    })}
                                </S.Divider>
                            )}
                        </S.Divider>
                    </S.Divider>
                </S.Content>
                )}
            </S.Container>
        </>
    )
}