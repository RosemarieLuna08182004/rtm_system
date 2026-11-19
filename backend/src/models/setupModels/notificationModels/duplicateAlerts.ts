import { GetService } from "../../../services";
import { NotificationQuery } from "../../../shared";
import NotificationModel from ".";

/**
 * Admin notifications when a save creates a duplicate. Same rules as the dashboard's
 * Needs Attention checks:
 * - term: same name (ignoring case, spacing and editor markup) twice in one volume
 * - sub term: same category, title and content twice under one term
 * Only a change that newly creates a duplicate alerts, so re-saving an existing
 * duplicate doesn't repeat it. Nothing here throws: a failed check must never
 * break the save that triggered it.
 */

type Row = Record<string, any>;
interface TermKey { ChapterId: number; Term: string | null }
interface SubTermKey { TermId: number; CategoryId: number; Term: string | null; Description: string | null }

export const normalize = (value?: string | null) =>
  (value ?? "").replace(/<[^>]*>|&nbsp;/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

const termKey = (t: TermKey) => (normalize(t.Term) ? `${Number(t.ChapterId)}|${normalize(t.Term)}` : "");
const subTermKey = (s: SubTermKey) =>
  [Number(s.TermId), Number(s.CategoryId), normalize(s.Term), normalize(s.Description)].join("|");

const newestId = (rows: Row[]) => Math.max(...rows.map((r) => Number(r.Id)));
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const log = (where: string, error: any) => {
  logging.log("----------------------------------------");
  logging.error(`DuplicateAlerts [${where}]:`, error?.message);
  logging.log("----------------------------------------");
};

/** Groups of 2+ rows sharing a key; rows with an empty key are ignored. */
const duplicateGroups = <T extends Row>(rows: T[], keyOf: (row: T) => string) => {
  const groups = new Map<string, T[]>();
  rows.forEach((row) => {
    const key = keyOf(row);
    if (key) groups.set(key, [...(groups.get(key) ?? []), row]);
  });
  return [...groups.values()].filter((group) => group.length > 1);
};

/** A term as it is now, to compare after an edit. */
const termSnapshot = async (Id: number): Promise<TermKey | null> => {
  try {
    const [row] = await GetService.byFields(NotificationQuery.q012, ["Id"], [Number], [Id]);
    return row ? { ChapterId: row.ChapterId, Term: row.Term } : null;
  } catch (error: any) { log("termSnapshot", error); return null; }
};

/** A sub term as it is now, to compare after an edit. */
const subTermSnapshot = async (Id: number): Promise<SubTermKey | null> => {
  try {
    const [row] = await GetService.byFields(NotificationQuery.q013, ["Id"], [Number], [Id]);
    return row ? { TermId: row.TermId, CategoryId: row.CategoryId, Term: row.Term, Description: row.Description } : null;
  } catch (error: any) { log("subTermSnapshot", error); return null; }
};

/**
 * After a term is added or edited. Pass `before` (from termSnapshot) for edits;
 * if the name and volume are unchanged no alert is raised.
 */
const afterTermSaved = async (saved: Partial<TermKey>, before: TermKey | null = null, CurrentId: number = 0) => {
  try {
    const now: TermKey = { ChapterId: Number(saved.ChapterId ?? before?.ChapterId), Term: saved.Term ?? before?.Term ?? null };
    const key = termKey(now);
    if (!key || (before && termKey(before) === key)) return;
    const siblings = await GetService.byFields(NotificationQuery.q005, ["ChapterId"], [Number], [now.ChapterId]);
    const matches = siblings.filter((t: Row) => termKey({ ChapterId: now.ChapterId, Term: t.Term }) === key);
    if (matches.length < 2) return;
    const [volume] = await GetService.byFields(NotificationQuery.q006, ["Id"], [Number], [now.ChapterId]);
    await NotificationModel.add(
      `Duplicate term found: "${String(now.Term).trim()}" now appears ${matches.length} times in ${volume?.Title ?? "the same volume"}.`,
      `/a/term/d/${newestId(matches)}`,
      CurrentId,
    );
  } catch (error: any) { log("afterTermSaved", error); }
};

/** After a sub term is added or edited. Pass `before` (from subTermSnapshot) for edits. */
const afterSubTermSaved = async (saved: Partial<SubTermKey>, before: SubTermKey | null = null, CurrentId: number = 0) => {
  try {
    const now: SubTermKey = {
      TermId: Number(saved.TermId ?? before?.TermId),
      CategoryId: Number(saved.CategoryId ?? before?.CategoryId),
      Term: saved.Term !== undefined ? saved.Term : before?.Term ?? null,
      Description: saved.Description !== undefined ? saved.Description : before?.Description ?? null,
    };
    if (!now.TermId || !now.CategoryId) return;
    const key = subTermKey(now);
    if (before && subTermKey(before) === key) return;
    const siblings = await GetService.byFields(NotificationQuery.q007, ["TermId", "CategoryId"], [Number, Number], [now.TermId, now.CategoryId]);
    const matches = siblings.filter((s: Row) => subTermKey({ ...now, Term: s.Term, Description: s.Description }) === key);
    if (matches.length < 2) return;
    const [names] = await GetService.byFields(NotificationQuery.q008, ["TermId", "CategoryId"], [Number, Number], [now.TermId, now.CategoryId]);
    await NotificationModel.add(
      `Duplicate sub term found: ${matches.length} identical "${names?.Category ?? "sub term"}" entries under "${String(names?.TermName ?? "a term").trim()}".`,
      `/a/termline/d/${newestId(matches)}`,
      CurrentId,
    );
  } catch (error: any) { log("afterSubTermSaved", error); }
};

/** Newest term and sub term ids, taken just before an import. */
const importSnapshot = async (): Promise<{ TermId: number; LineId: number } | null> => {
  try {
    const [row] = await GetService.byQuery(NotificationQuery.q009);
    return row ? { TermId: Number(row.TermId), LineId: Number(row.LineId) } : null;
  } catch (error: any) { log("importSnapshot", error); return null; }
};

/** After an import: one summary alert if any duplicate group includes a newly imported record. */
const afterImport = async (before: { TermId: number; LineId: number } | null, CurrentId: number = 0) => {
  try {
    if (!before) return;
    const terms = await GetService.byQuery(NotificationQuery.q010);
    const lines = await GetService.byQuery(NotificationQuery.q011);
    const newTermGroups = duplicateGroups(terms, (t: Row) => termKey(t as TermKey))
      .filter((group) => group.some((t) => Number(t.Id) > before.TermId)).length;
    const newLineGroups = duplicateGroups(lines, (s: Row) => subTermKey(s as SubTermKey))
      .filter((group) => group.some((s) => Number(s.Id) > before.LineId)).length;
    if (!newTermGroups && !newLineGroups) return;
    const parts = [newTermGroups && plural(newTermGroups, "duplicate term"), newLineGroups && plural(newLineGroups, "duplicate sub term")].filter(Boolean);
    await NotificationModel.add(
      `Import created duplicates: ${parts.join(" and ")}. See Needs Attention on the Dashboard.`,
      "/a",
      CurrentId,
    );
  } catch (error: any) { log("afterImport", error); }
};

export const DuplicateAlerts = { termSnapshot, subTermSnapshot, afterTermSaved, afterSubTermSaved, importSnapshot, afterImport };
