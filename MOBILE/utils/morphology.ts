// Reads a term's "Root" and "Term Morphology" entries (HTML written in the web admin)
// into word-part chips, e.g. Adrenaline → Ad (to) + Ren (the kidney) + -al + -ine.
//
// Content patterns this relies on:
//   Root:        <p><strong><em>Ren</em></strong> (plu., Renes), the kidney</p>
//   Morphology:  <p>comp., <u>Ad</u> + <u>Ren</u> + <u>-al</u> + <u>-ine</u></p>
//                <p>Figuratively, "hormone from the gland at the kidney"</p>
//                <p><em>-ion</em> (suffix), forms noun of action</p>

export type WordPartType = "root" | "suffix";

export interface WordPart {
  text: string;            // as shown, e.g. "Ren", "-al"
  type: WordPartType;
  meaning?: string;        // e.g. "the kidney"
  origin?: string;         // e.g. "Latin", "Greek"
  rootWord?: string;       // exact word stored in the Root entry; used to find related terms
}

export interface WordBreakdown {
  parts: WordPart[];
  literal?: string;        // e.g. "hormone from the gland at the kidney"
}

interface Entry {
  word: string;
  meaning?: string;
  origin?: string;
}

interface SubTermLike {
  Category?: string | null;
  Description?: string | null;
}

const ENTITIES: Record<string, string> = { "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'" };

const decode = (text: string) =>
  text
    .replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? " ")
    .replace(/�/g, " ")      // broken characters from old imports
    .replace(/\s+/g, " ")
    .trim();

const stripTags = (html: string) => decode(html.replace(/<[^>]+>/g, " "));

// Paragraphs as raw HTML (so the formatted first word can still be found).
const paragraphs = (html: string): string[] => {
  const found = html.match(/<(p|li)\b[^>]*>[\s\S]*?<\/(p|li)>/gi);
  return (found ?? [html]).map((p) => p.trim()).filter((p) => stripTags(p).length > 0);
};

// Old imports turned curly quotes into "?". Trims them (and other wrappers) at the ends,
// and turns the ones inside a phrase back into quotes: 'from ?gland above?' → 'from “gland above”'.
const cleanPhrase = (text: string) =>
  text
    .replace(/^[\s?"'“”‘’.,;:]+|[\s?"'“”‘’.,;:]+$/g, "")
    .replace(/(^|[\s(,;:])\?(?=\w)/g, "$1“")
    .replace(/(\w)\?(?=[\s),;:.]|$)/g, "$1”")
    .replace(/\s+/g, " ")
    .trim();

const ORIGINS: Record<string, string> = { "l.": "Latin", "gr.": "Greek", "fr.": "French", "ar.": "Arabic", "ger.": "German" };
const originLabel = (raw?: string) => {
  if (!raw) return undefined;
  const key = raw.trim().toLowerCase().split(/\s+/)[0];
  return ORIGINS[key];
};

// "<strong><em>Ren</em></strong> (plu., Renes), the kidney" → { word: "Ren", meaning: "the kidney", origin: undefined }
const parseEntry = (paragraphHtml: string): Entry | null => {
  const formatted = paragraphHtml.match(/<(strong|em|b|i|u)\b[^>]*>(?:\s*<[^>]+>)*\s*([^<]+?)\s*</i);
  const text = stripTags(paragraphHtml);
  const word = cleanPhrase(formatted?.[2] ? decode(formatted[2]) : "");
  if (!word || word.length > 30 || !text.toLowerCase().startsWith(word.toLowerCase())) return null;
  const rest = text.slice(word.length).trim();
  const paren = rest.match(/^\(([^)]*)\)\s*,?\s*(.*)$/);
  // Suffix notes often start with the word "suffix": "-yl (Biochemistry), suffix, denotes free radicals".
  const meaning = cleanPhrase((paren ? paren[2] : rest.replace(/^[,:\-–]\s*/, "")).replace(/^suffix\s*[,:]?\s*/i, ""));
  return { word, meaning: meaning || undefined, origin: originLabel(paren?.[1]) };
};

const normalize = (text: string) => text.toLowerCase().replace(/[^a-zÀ-ſ]/g, "");

// Matches a composition part to a root entry, allowing for stems ("Agglutinat-" ↔ "Agglutinare").
const findEntry = (part: string, entries: Entry[]): Entry | undefined => {
  const p = normalize(part);
  if (p.length < 2) return undefined;
  let best: Entry | undefined;
  let bestScore = 0;
  for (const entry of entries) {
    const w = normalize(entry.word);
    if (!w) continue;
    if (w === p) return entry;
    let common = 0;
    while (common < Math.min(w.length, p.length) && w[common] === p[common]) common++;
    const shorter = Math.min(w.length, p.length);
    // Stems share their start with the root: "Vaso-" ↔ "Vasum", "Agglutinat-" ↔ "Agglutinatum".
    const good = common >= Math.min(3, shorter) && common >= Math.ceil(shorter * 0.6);
    if (good && common > bestScore) { best = entry; bestScore = common; }
  }
  return best;
};

const isSuffix = (text: string) => text.trim().startsWith("-");

export const parseWordBreakdown = (subterms: SubTermLike[]): WordBreakdown => {
  const byCategory = (name: string) =>
    subterms.filter((s) => String(s.Category ?? "").trim().toLowerCase() === name).map((s) => String(s.Description ?? ""));

  const rootEntries = byCategory("root").flatMap(paragraphs).map(parseEntry).filter((e): e is Entry => !!e);
  const morphologyParas = byCategory("term morphology").flatMap(paragraphs);

  // Suffix explanations in the morphology entry, e.g. "-ion (suffix), forms noun of action".
  const suffixEntries = morphologyParas
    .map(parseEntry)
    .filter((e): e is Entry => !!e && isSuffix(e.word));
  const entries = [...rootEntries, ...suffixEntries];

  let literal: string | undefined;
  let composition: string[] = [];
  for (const para of morphologyParas) {
    const text = stripTags(para);
    const lit = text.match(/\b(figuratively|literally|metaphorically)\s*[,:]?\s*(.+)$/i);
    if (lit && !literal) literal = cleanPhrase(lit[2]) || undefined;
    // "comp., Ad + Ren + -al" or "Compound of: Prona -ation"
    const comp = text.match(/(?:comp\.|compound of)\s*[,:]?\s*(.+)$/i);
    if (comp && composition.length === 0) {
      const raw = comp[1];
      const pieces = (raw.includes("+") ? raw.split("+") : raw.split(/\s+(?=-)/))
        .map((piece) => cleanPhrase(piece))
        .filter(Boolean);
      // Only trust a composition that looks like word parts.
      if (pieces.length >= 2 && pieces.length <= 8 && pieces.every((piece) => piece.length <= 30)) composition = pieces;
    }
  }

  const toPart = (text: string): WordPart => {
    const entry = findEntry(text, entries);
    const suffix = isSuffix(text);
    return {
      text,
      type: suffix ? "suffix" : "root",
      meaning: entry?.meaning,
      origin: entry?.origin,
      rootWord: !suffix && entry && !isSuffix(entry.word) ? entry.word : undefined,
    };
  };

  const parts = composition.length > 0
    ? composition.map(toPart)
    : rootEntries.map((entry) => ({
        text: entry.word,
        type: (isSuffix(entry.word) ? "suffix" : "root") as WordPartType,
        meaning: entry.meaning,
        origin: entry.origin,
        rootWord: isSuffix(entry.word) ? undefined : entry.word,
      }));

  // Drop exact duplicates (some entries repeat a root).
  const seen = new Set<string>();
  return {
    parts: parts.filter((part) => {
      const key = part.text.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }),
    literal,
  };
};
