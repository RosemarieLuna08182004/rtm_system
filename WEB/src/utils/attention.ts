import { CategoryTables, ChapterTables, RouteChannel, TermLineTables, TermTables } from "../types";

/**
 * "Needs Attention" detection.
 *
 * The database has no draft/status column on Term, TermLine, Volume or Category,
 * so issues are derived from data the dashboard already loads. Nothing here
 * calls the backend.
 */

export type AttentionSeverity = 'high' | 'medium' | 'low';

export interface AttentionItem {
    id: string | number;
    label: string;
    sublabel?: string;
    route: string;
}

export interface AttentionIssue {
    key: string;
    title: string;
    description: string;
    severity: AttentionSeverity;
    count: number;
    /** First few affected records, for quick jump-to-fix links */
    items: AttentionItem[];
    /** Ids of every affected record, so the list page can show just these */
    ids: Array<string | number>;
    /** List page that shows everything of this kind */
    viewAllRoute: string;
}

/** Passed in router state from "View all" so a list page shows only the flagged records. */
export interface AttentionFilter {
    key: string;
    title: string;
    ids: Array<string | number>;
    /** Where the filter came from, shown in the banner; defaults to Needs Attention */
    source?: 'attention' | 'search';
}

export const toAttentionFilter = ({ key, title, ids }: AttentionIssue): AttentionFilter => ({ key, title, ids });

export interface AttentionInput {
    terms: TermTables;
    subterms: TermLineTables;
    chapters: ChapterTables;
    categories: CategoryTables;
}

/**
 * A term's definition is written as a sub term in this category (Term.Definition is no
 * longer used). Matched by name because the sub term list returns the category name only.
 */
export const BRIEF_DEFINITION_CATEGORY = 'brief definition';
/** Max affected records listed per issue. */
export const MAX_ITEMS_PER_ISSUE = 5;

const SEVERITY_ORDER: Record<AttentionSeverity, number> = { high: 0, medium: 1, low: 2 };

const isBlank = (value?: string | null) => !value || value.trim().length === 0;
// RichText editor output for an empty field is often "<p><br></p>" rather than "".
const isBlankRich = (value?: string | null) => isBlank(value?.replace(/<[^>]*>|&nbsp;/g, ''));

// Compare text ignoring case, extra spaces and editor markup, so " Atlas" and "atlas" match.
const normalize = (value?: string | null) => (value ?? '').replace(/<[^>]*>|&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

/** Rows sharing the same key, in groups of 2+. Rows with an empty key are ignored. */
const findDuplicates = <T,>(rows: T[], keyOf: (row: T) => string | null): T[][] => {
    const groups = new Map<string, T[]>();
    rows.forEach(row => {
        const key = keyOf(row);
        if (!key) return;
        const group = groups.get(key);
        if (group) group.push(row);
        else groups.set(key, [row]);
    });
    return [...groups.values()].filter(group => group.length > 1);
};

/** Newest record in a duplicate group: usually the accidental copy. */
const newest = <T extends { Id?: string | number }>(group: T[]) => group.reduce((a, b) => (Number(b.Id) > Number(a.Id) ? b : a));
const copiesLabel = <T extends { Id?: string | number }>(group: T[]) => `${group.length} copies · IDs ${group.map(r => r.Id).join(', ')}`;

const detailRoute = (route: RouteChannel, id: string | number) => route.replace(':Id', String(id));

const buildIssue = <T,>(
    base: Omit<AttentionIssue, 'count' | 'items' | 'ids'>,
    matches: T[],
    toItem: (row: T) => AttentionItem,
    // A match is one record, or a group of records for duplicate checks
    idsOf: (row: T) => Array<string | number | undefined> = (row) => [(row as { Id?: string | number }).Id]
): AttentionIssue | null => {
    if (matches.length === 0) return null;
    const ids = matches.flatMap(idsOf).filter((id): id is string | number => id !== undefined && id !== '');
    return { ...base, count: matches.length, items: matches.slice(0, MAX_ITEMS_PER_ISSUE).map(toItem), ids };
};

export const getAttentionIssues = ({ terms, subterms, chapters, categories }: AttentionInput): AttentionIssue[] => {
    const issues: (AttentionIssue | null)[] = [];

    const termItem = (t: TermTables[number]): AttentionItem => ({
        id: t.Id ?? '',
        label: t.Term?.trim() || '(untitled term)',
        sublabel: t.ChapterTitle,
        route: detailRoute(RouteChannel.TERM_DETAILS, t.Id ?? ''),
    });

    // --- Incomplete terms ---------------------------------------------------

    // --- Incomplete sub terms -----------------------------------------------
    issues.push(buildIssue(
        { key: 'subterms-no-description', title: 'Sub terms missing a description', description: 'Sub term has a title but no content.', severity: 'medium', viewAllRoute: RouteChannel.TERM_LINE },
        subterms.filter(s => isBlankRich(s.Description)),
        s => ({
            id: s.Id ?? '',
            label: s.Term?.trim() || '(untitled sub term)',
            sublabel: s.TermName,
            route: detailRoute(RouteChannel.TERM_LINE_DETAILS, s.Id ?? ''),
        })
    ));

    // --- Duplicates ------------------------------------------------------------
    // The same term name in different volumes is intentional (one term taught under
    // several body systems), so only repeats within one volume count.
    issues.push(buildIssue(
        { key: 'terms-duplicate', title: 'Duplicate terms', description: 'Same term name entered twice in one volume.', severity: 'medium', viewAllRoute: RouteChannel.TERM },
        findDuplicates(terms, t => normalize(t.Term) ? `${t.ChapterId}|${normalize(t.Term)}` : null),
        group => {
            const copy = newest(group);
            return {
                id: `${copy.ChapterId}-${copy.Id}`,
                label: copy.Term?.trim() || '(untitled term)',
                sublabel: `${copy.ChapterTitle ?? 'No volume'} · ${copiesLabel(group)}`,
                route: detailRoute(RouteChannel.TERM_DETAILS, copy.Id ?? ''),
            };
        },
        group => group.map(t => t.Id)
    ));

    // Same term, category, title and content. Two different Brief Definitions under
    // one term are not counted: their content differs.
    issues.push(buildIssue(
        { key: 'subterms-duplicate', title: 'Duplicate sub terms', description: 'Same sub term added twice under one term.', severity: 'medium', viewAllRoute: RouteChannel.TERM_LINE },
        findDuplicates(subterms, s => [s.TermId, normalize(s.Category), normalize(s.Term), normalize(s.Description)].join('|')),
        group => {
            const copy = newest(group);
            return {
                id: copy.Id ?? '',
                label: copy.Term?.trim() || copy.Category?.trim() || '(untitled sub term)',
                sublabel: `${copy.TermName?.trim() ?? 'Unknown term'} · ${copiesLabel(group)}`,
                route: detailRoute(RouteChannel.TERM_LINE_DETAILS, copy.Id ?? ''),
            };
        },
        group => group.map(s => s.Id)
    ));

    // --- Cross-reference checks ----------------------------------------------
    // Skipped when the other list is empty: that usually means it failed to load,
    // and flagging every record would be a false alarm.
    if (terms.length > 0 && subterms.length > 0) {
        const isBriefDefinition = (s: TermLineTables[number]) => (s.Category ?? '').trim().toLowerCase() === BRIEF_DEFINITION_CATEGORY;
        // Skipped if no sub term uses the category at all (e.g. it was renamed),
        // so every term isn't flagged by mistake.
        if (subterms.some(isBriefDefinition)) {
            const termIdsWithBriefDefinition = new Set(
                subterms.filter(s => isBriefDefinition(s) && !isBlankRich(s.Description)).map(s => Number(s.TermId))
            );
            issues.push(buildIssue(
                { key: 'terms-no-brief-definition', title: 'Terms missing a brief definition', description: 'No filled-in "Brief Definition" sub term.', severity: 'high', viewAllRoute: RouteChannel.TERM },
                terms.filter(t => !termIdsWithBriefDefinition.has(Number(t.Id))),
                termItem
            ));
        }

        const termIdsWithSubterms = new Set(subterms.map(s => Number(s.TermId)));
        issues.push(buildIssue(
            { key: 'terms-no-subterms', title: 'Terms with no sub terms', description: 'Term has a definition but nothing beneath it.', severity: 'high', viewAllRoute: RouteChannel.TERM },
            terms.filter(t => !termIdsWithSubterms.has(Number(t.Id))),
            termItem
        ));
    }

    if (chapters.length > 0 && terms.length > 0) {
        const chapterIdsWithTerms = new Set(terms.map(t => Number(t.ChapterId)));
        issues.push(buildIssue(
            { key: 'volumes-empty', title: 'Empty volumes', description: 'Volume has no terms yet.', severity: 'high', viewAllRoute: RouteChannel.CHAPTER },
            chapters.filter(c => !chapterIdsWithTerms.has(Number(c.Id))),
            c => ({ id: c.Id ?? '', label: c.Title?.trim() || '(untitled volume)', route: detailRoute(RouteChannel.CHAPTER_DETAILS, c.Id ?? '') })
        ));
    }

    if (categories.length > 0 && subterms.length > 0) {
        // The sub term list endpoint returns the category name, not its id.
        const usedCategoryNames = new Set(subterms.map(s => (s.Category ?? '').trim().toLowerCase()));
        issues.push(buildIssue(
            { key: 'categories-unused', title: 'Unused categories', description: 'No sub term uses this category.', severity: 'low', viewAllRoute: RouteChannel.CATEGORY },
            categories.filter(c => !usedCategoryNames.has((c.Category ?? '').trim().toLowerCase())),
            c => ({ id: c.Id ?? '', label: c.Category?.trim() || '(unnamed category)', route: detailRoute(RouteChannel.CATEGORY_DETAILS, c.Id ?? '') })
        ));
    }

    return issues
        .filter((i): i is AttentionIssue => i !== null)
        .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.count - a.count);
};