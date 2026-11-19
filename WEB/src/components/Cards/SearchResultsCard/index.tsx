import { Fragment, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShortTextIcon from '@mui/icons-material/ShortText';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { MIN_SEARCH_LENGTH, SearchGroup } from "../../../utils/search";
import { SFC } from "../../../types";
import * as S from '../../../styles'

interface SearchResultsCardProps {
    Query: string;
    Groups: SearchGroup[];
    Loading?: boolean;
}

const GROUP_ICONS: Record<SearchGroup['key'], { Icon: typeof SearchIcon; tone: string }> = {
    terms: { Icon: ShortTextIcon, tone: 'bg-teal-50 text-teal-600' },
    subterms: { Icon: ListAltOutlinedIcon, tone: 'bg-orange-50 text-orange-500' },
    volumes: { Icon: MenuBookOutlinedIcon, tone: 'bg-blue-50 text-primary' },
    categories: { Icon: CategoryOutlinedIcon, tone: 'bg-violet-50 text-violet-500' },
    users: { Icon: PeopleOutlineIcon, tone: 'bg-indigo-50 text-indigo-500' },
};

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wraps each typed word in <mark> */
const highlight = (text: string | undefined, query: string): ReactNode => {
    if (!text) return text;
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean).map(escapeRegExp);
    if (!words.length) return text;
    const parts = text.split(new RegExp(`(${words.join('|')})`, 'gi'));
    return parts.map((part, i) => i % 2 === 1
        ? <mark key={i} className="bg-yellow-100 text-inherit rounded-sm">{part}</mark>
        : <Fragment key={i}>{part}</Fragment>);
};

/** Dashboard search results, grouped by kind of record. */
export const SearchResultsCard: SFC<SearchResultsCardProps> = ({ ClassName, Query, Groups, Loading = false }) => {
    const navigate = useNavigate();
    const query = Query.trim();
    const total = Groups.reduce((sum, g) => sum + g.total, 0);

    const viewAll = (group: SearchGroup) => navigate(group.listRoute, {
        state: { attention: { key: `search-${group.key}`, title: query, ids: group.ids, source: 'search' } },
    });

    return (
        <S.Container className={twMerge("w-full min-w-0 bg-white rounded-lg border border-slate-200/70 shadow-sm p-4", ClassName)}>
            <S.Divider className="flex items-center justify-between mb-3 gap-2">
                <S.Divider className="flex items-center gap-2 min-w-0">
                    <SearchIcon className="text-primary" fontSize="small" />
                    <S.Span className="font-semibold text-zinc-700 truncate">Search results for "{query}"</S.Span>
                    {!Loading && total > 0 && (
                        <S.Span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-primary">{total.toLocaleString()}</S.Span>
                    )}
                </S.Divider>
                <S.Span className="hidden md:inline text-xs text-slate-400 shrink-0">Press Esc to clear</S.Span>
            </S.Divider>

            {query.length < MIN_SEARCH_LENGTH ? (
                <S.Span className="block text-sm text-slate-500 py-6 text-center">Type at least {MIN_SEARCH_LENGTH} characters to search.</S.Span>
            ) : Loading ? (
                <S.Span className="block text-sm text-slate-500 py-6 text-center">Loading content to search…</S.Span>
            ) : Groups.length === 0 ? (
                <S.Divider className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
                    <SearchOffIcon fontSize="large" />
                    <S.Span className="text-sm">No terms, sub terms, volumes, categories or users match "{query}".</S.Span>
                </S.Divider>
            ) : (
                <S.Divider className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {Groups.map(group => {
                        const { Icon, tone } = GROUP_ICONS[group.key];
                        return (
                            <S.Divider key={group.key} className="flex flex-col gap-1 min-w-0">
                                <S.Divider className="flex items-center gap-2 mb-1">
                                    <S.Divider className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${tone}`}><Icon style={{ fontSize: 16 }} /></S.Divider>
                                    <S.Span className="text-sm font-semibold text-zinc-700">{group.title}</S.Span>
                                    <S.Span className="text-xs text-slate-400">{group.total.toLocaleString()}</S.Span>
                                </S.Divider>
                                {group.hits.map(hit => (
                                    <button key={`${group.key}-${hit.id}`} type="button" onClick={() => navigate(hit.route)}
                                        className="flex items-center justify-between gap-2 text-left bg-slate-50 hover:bg-blue-50 rounded-md px-3 py-2 border-0 cursor-pointer">
                                        <S.Divider className="flex flex-col min-w-0">
                                            <S.Span className="text-sm text-zinc-700 truncate">{highlight(hit.label, query)}</S.Span>
                                            {hit.sublabel && <S.Span className="text-xs text-slate-400 truncate">{highlight(hit.sublabel, query)}</S.Span>}
                                            {hit.snippet && <S.Span className="text-xs text-slate-500 italic line-clamp-2">{highlight(hit.snippet, query)}</S.Span>}
                                        </S.Divider>
                                        <ChevronRightIcon fontSize="small" className="text-slate-400 shrink-0" />
                                    </button>
                                ))}
                                {group.total > group.hits.length && (
                                    <button type="button" onClick={() => viewAll(group)}
                                        className="self-start mt-1 text-xs font-medium text-primary bg-transparent border-0 cursor-pointer hover:underline">
                                        View all {group.total.toLocaleString()} {group.noun} in list →
                                    </button>
                                )}
                            </S.Divider>
                        );
                    })}
                </S.Divider>
            )}
        </S.Container>
    );
};
