import { CategoryTables, ChapterTables, RouteChannel, TermLineTables, TermTables, UserTables } from "../types";

/**
 * Dashboard search over the lists the dashboard already loads (no extra requests).
 * Every word typed must appear somewhere in a record (case, spacing and editor markup ignored).
 * Records whose name starts with the query rank first, then names containing it, then the rest.
 */

export const MIN_SEARCH_LENGTH = 2;
export const MAX_HITS_PER_GROUP = 6;

export interface SearchHit {
    id: string | number;
    label: string;
    sublabel?: string;
    /** A bit of longer text around the match, e.g. a sub term's description */
    snippet?: string;
    route: string;
}

export interface SearchGroup {
    key: 'terms' | 'subterms' | 'volumes' | 'categories' | 'users';
    title: string;
    /** Plural record name for "View all", e.g. "terms" */
    noun: string;
    /** List page that can show all matches */
    listRoute: string;
    total: number;
    ids: Array<string | number>;
    hits: SearchHit[];
}

export interface SearchInput {
    terms: TermTables;
    subterms: TermLineTables;
    chapters: ChapterTables;
    categories: CategoryTables;
    users: UserTables;
}

/** Plain text: editor markup removed, spacing collapsed */
export const plainText = (value?: string | null) =>
    (value ?? '').replace(/<[^>]*>|&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const normalize = (value?: string | null) => plainText(value).toLowerCase();

const detailRoute = (route: RouteChannel, id: string | number) => route.replace(':Id', String(id));

/** ~90 characters of `text` around the first query word */
const snippetAround = (text: string, words: string[]) => {
    const lower = text.toLowerCase();
    const at = Math.min(...words.map(w => lower.indexOf(w)).filter(i => i >= 0));
    if (!isFinite(at)) return undefined;
    const start = Math.max(0, at - 30);
    const end = Math.min(text.length, at + 60);
    return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
};

const searchRows = <T,>(
    rows: T[],
    words: string[],
    phrase: string,
    nameOf: (row: T) => string,
    otherText: (row: T) => Array<string | null | undefined>,
    toHit: (row: T) => SearchHit,
) => {
    const scored: { row: T; score: number; name: string }[] = [];
    rows.forEach(row => {
        const name = normalize(nameOf(row));
        const all = [name, ...otherText(row).map(normalize)].join(' \u0000 ');
        if (!words.every(word => all.includes(word))) return;
        const score = name.startsWith(phrase) ? 0 : name.includes(phrase) ? 1 : 2;
        scored.push({ row, score, name });
    });
    scored.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
    return {
        total: scored.length,
        ids: scored.map(s => (s.row as { Id?: string | number }).Id).filter((id): id is string | number => id !== undefined),
        hits: scored.slice(0, MAX_HITS_PER_GROUP).map(s => toHit(s.row)),
    };
};

export const searchContent = (query: string, { terms, subterms, chapters, categories, users }: SearchInput): SearchGroup[] => {
    const phrase = normalize(query);
    if (phrase.length < MIN_SEARCH_LENGTH) return [];
    const words = phrase.split(' ').filter(Boolean);

    const groups: SearchGroup[] = [
        {
            key: 'terms', title: 'Terms', noun: 'terms', listRoute: RouteChannel.TERM,
            ...searchRows(terms, words, phrase, t => t.Term ?? '', t => [t.Focus, t.ChapterTitle], t => ({
                id: t.Id ?? '', label: plainText(t.Term) || '(untitled term)', sublabel: t.ChapterTitle,
                route: detailRoute(RouteChannel.TERM_DETAILS, t.Id ?? ''),
            })),
        },
        {
            key: 'subterms', title: 'Sub Terms', noun: 'sub terms', listRoute: RouteChannel.TERM_LINE,
            ...searchRows(subterms, words, phrase, s => s.Term ?? '', s => [s.Description, s.TermName, s.Category], s => ({
                id: s.Id ?? '',
                label: plainText(s.Term) || plainText(s.Category) || '(untitled sub term)',
                sublabel: [plainText(s.TermName), plainText(s.Category)].filter(Boolean).join(' · '),
                snippet: snippetAround(plainText(s.Description), words),
                route: detailRoute(RouteChannel.TERM_LINE_DETAILS, s.Id ?? ''),
            })),
        },
        {
            key: 'volumes', title: 'Volumes', noun: 'volumes', listRoute: RouteChannel.CHAPTER,
            ...searchRows(chapters, words, phrase, c => c.Title ?? '', () => [], c => ({
                id: c.Id ?? '', label: plainText(c.Title) || '(untitled volume)',
                route: detailRoute(RouteChannel.CHAPTER_DETAILS, c.Id ?? ''),
            })),
        },
        {
            key: 'categories', title: 'Categories', noun: 'categories', listRoute: RouteChannel.CATEGORY,
            ...searchRows(categories, words, phrase, c => c.Category ?? '', c => [c.Description], c => ({
                id: c.Id ?? '', label: plainText(c.Category) || '(unnamed category)', sublabel: plainText(c.Description) || undefined,
                route: detailRoute(RouteChannel.CATEGORY_DETAILS, c.Id ?? ''),
            })),
        },
        {
            key: 'users', title: 'Users', noun: 'users', listRoute: RouteChannel.USER,
            ...searchRows(users, words, phrase, u => u.Name ?? '', u => [u.Email], u => ({
                id: u.Id ?? '', label: plainText(u.Name) || u.Email, sublabel: u.Email,
                route: detailRoute(RouteChannel.USER_DETAILS, u.Id ?? ''),
            })),
        },
    ];
    return groups.filter(g => g.total > 0);
};
