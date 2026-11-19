/**
 * Plans a spreadsheet (Excel / CSV) import of terms and sub terms.
 *
 * Rows refer to volumes, terms and categories by name. This works out, for every
 * row, whether it will be added, skipped (already exists) or has a problem, without
 * touching the database: the caller passes in what already exists and saves the
 * result. Kept separate so it can be tested on its own.
 */

export interface TermRowInput { Row: number; Volume: string; Term: string; Focus?: string | null }
export interface SubTermRowInput { Row: number; Volume: string; Term: string; Category: string; Title?: string | null; Description: string }

export interface ImportLookups {
  volumes: Array<{ Id: number; Title: string }>;
  categories: Array<{ Id: number; Category: string }>;
  terms: Array<{ Id: number; ChapterId: number; Term: string }>;
  subTerms: Array<{ TermId: number; CategoryId: number; Term: string | null; Description: string | null }>;
  /** Highest Position used so far, per term id */
  positions: Array<{ TermId: number; Position: number }>;
}

export type RowStatus = "add" | "skip" | "error";
export interface RowResult { Sheet: "Terms" | "Sub Terms"; Row: number; Name: string; Status: RowStatus; Message: string }

/** A term to insert. `Key` lets sub terms in the same file point at it before it has an id. */
export interface PlannedTerm { Key: string; ChapterId: number; Term: string; Focus: string | null }
/** A sub term to insert, under an existing term (TermId) or one added by this import (TermKey). */
export interface PlannedSubTerm { TermId: number | null; TermKey: string | null; CategoryId: number; Term: string; Description: string; Position: number }

export interface ImportPlan { results: RowResult[]; terms: PlannedTerm[]; subTerms: PlannedSubTerm[] }

/** Same letters-only rule the term and sub term forms use. */
export const NAME_PATTERN = /^[A-Za-z\s.,'-/]+$/;

/** Ignores case, extra spaces and editor markup (same rule as the duplicate checks). */
export const normalize = (value?: string | null) =>
  (value ?? "").replace(/<[^>]*>|&nbsp;/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Sub term descriptions are stored as rich text (HTML). Plain spreadsheet text is
 * escaped, and each line becomes a paragraph, so it shows the same as typed.
 */
export const toRichText = (text: string) =>
  text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");

const clean = (value?: string | null) => (value ?? "").replace(/\s+/g, " ").trim();

export const planImport = (termRows: TermRowInput[], subTermRows: SubTermRowInput[], lookups: ImportLookups): ImportPlan => {
  const results: RowResult[] = [];
  const terms: PlannedTerm[] = [];
  const subTerms: PlannedSubTerm[] = [];

  const volumeByName = new Map<string, number>();
  lookups.volumes.forEach((v) => { if (!volumeByName.has(normalize(v.Title))) volumeByName.set(normalize(v.Title), Number(v.Id)); });
  const categoryByName = new Map<string, number>();
  lookups.categories.forEach((c) => { if (!categoryByName.has(normalize(c.Category))) categoryByName.set(normalize(c.Category), Number(c.Id)); });

  const termKey = (chapterId: number, term: string) => `${chapterId}|${normalize(term)}`;
  // If a name is already duplicated in a volume, sub terms go under the oldest copy
  const existingTerms = new Map<string, number>();
  [...lookups.terms].sort((a, b) => Number(a.Id) - Number(b.Id)).forEach((t) => {
    const key = termKey(Number(t.ChapterId), t.Term);
    if (!existingTerms.has(key)) existingTerms.set(key, Number(t.Id));
  });

  const missingVolume = (name: string) => `No volume called "${name}". Check the spelling against the Volumes list.`;

  // --- Terms --------------------------------------------------------------
  const plannedTermKeys = new Set<string>();
  const failedTermKeys = new Set<string>();
  termRows.forEach((row) => {
    const name = clean(row.Term);
    const volume = clean(row.Volume);
    const result = (Status: RowStatus, Message: string) => results.push({ Sheet: "Terms", Row: row.Row, Name: name || "(no term)", Status, Message });

    if (!volume) return result("error", "Volume is empty.");
    if (!name) return result("error", "Term is empty.");
    if (name.length > 255) return result("error", "Term is longer than 255 characters.");
    if (!NAME_PATTERN.test(name)) return result("error", "Term may only contain letters, spaces and . , ' - / ( )");

    const chapterId = volumeByName.get(normalize(volume));
    if (!chapterId) return result("error", missingVolume(volume));

    const key = termKey(chapterId, name);
    if (existingTerms.has(key)) return result("skip", `Already in ${volume}; skipped.`);
    if (plannedTermKeys.has(key)) return result("skip", "Appears earlier in this file; skipped.");

    const focus = clean(row.Focus);
    if (focus.length > 255) { failedTermKeys.add(key); return result("error", "Focus is longer than 255 characters."); }

    plannedTermKeys.add(key);
    terms.push({ Key: key, ChapterId: chapterId, Term: name, Focus: focus || null });
    result("add", `New term in ${volume}.`);
  });

  // --- Sub terms ----------------------------------------------------------
  const existingSubTerms = new Set(
    lookups.subTerms.map((s) => [Number(s.TermId), Number(s.CategoryId), normalize(s.Term), normalize(s.Description)].join("|")),
  );
  const plannedSubTermKeys = new Set<string>();
  const nextPosition = new Map<string, number>();
  lookups.positions.forEach((p) => nextPosition.set(`id:${Number(p.TermId)}`, Number(p.Position) || 0));

  subTermRows.forEach((row) => {
    const termName = clean(row.Term);
    const volume = clean(row.Volume);
    const category = clean(row.Category);
    const title = clean(row.Title);
    const description = (row.Description ?? "").trim();
    const label = title || category || "(no title)";
    const result = (Status: RowStatus, Message: string) => results.push({ Sheet: "Sub Terms", Row: row.Row, Name: termName ? `${termName} › ${label}` : label, Status, Message });

    if (!volume) return result("error", "Volume is empty.");
    if (!termName) return result("error", "Term is empty.");
    if (!category) return result("error", "Category is empty.");
    if (!description) return result("error", "Description is empty.");
    if (title.length > 255) return result("error", "Title is longer than 255 characters.");
    if (title && !NAME_PATTERN.test(title)) return result("error", "Title may only contain letters, spaces and . , ' - / ( )");

    const chapterId = volumeByName.get(normalize(volume));
    if (!chapterId) return result("error", missingVolume(volume));
    const categoryId = categoryByName.get(normalize(category));
    if (!categoryId) return result("error", `No category called "${category}". Check the spelling against the Categories list.`);

    const key = termKey(chapterId, termName);
    const existingTermId = existingTerms.get(key) ?? null;
    const newTerm = !existingTermId && plannedTermKeys.has(key);
    if (!existingTermId && !newTerm) {
      return result("error", failedTermKeys.has(key)
        ? `The row for term "${termName}" on the Terms sheet has a problem; fix that first.`
        : `No term "${termName}" in ${volume}. Add it on the Terms sheet.`);
    }

    const richText = toRichText(description);
    const termRef = existingTermId ? `id:${existingTermId}` : `new:${key}`;
    const dupKey = [termRef, categoryId, normalize(title), normalize(richText)].join("|");
    if (existingTermId && existingSubTerms.has([existingTermId, categoryId, normalize(title), normalize(richText)].join("|")))
      return result("skip", "The same sub term already exists; skipped.");
    if (plannedSubTermKeys.has(dupKey)) return result("skip", "Appears earlier in this file; skipped.");

    plannedSubTermKeys.add(dupKey);
    const position = (nextPosition.get(termRef) ?? 0) + 1;
    nextPosition.set(termRef, position);
    subTerms.push({ TermId: existingTermId, TermKey: existingTermId ? null : key, CategoryId: categoryId, Term: title, Description: richText, Position: position });
    result("add", newTerm ? `Added under the new term "${termName}".` : `Added under "${termName}".`);
  });

  return { results, terms, subTerms };
};
