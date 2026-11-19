/**
 * Checks a bulk-import script before it is run against the database.
 *
 * Only one shape is accepted, the one a database dump produces:
 *   INSERT INTO `term` [(column, ...)] VALUES (value, ...), (value, ...);
 * into `term` or `termline`, where every value is a quoted string, a number, NULL,
 * TRUE/FALSE, DEFAULT, NOW() or CURRENT_TIMESTAMP. Anything else (DROP, UPDATE,
 * SELECT, other tables, functions, extra statements, MySQL "executable comments")
 * is refused, so an import can only add terms and sub terms.
 */

const ALLOWED: Record<string, string[]> = {
  term: ["id", "chapterid", "term", "focus", "definition", "illustration", "createdby", "datecreated", "updatedby", "dateupdated"],
  termline: ["id", "termid", "categoryid", "term", "description", "position", "isborderleft", "illustration", "createdby", "datecreated", "updatedby", "dateupdated"],
};
const PLAIN_VALUES = ["null", "true", "false", "default", "current_timestamp"];

type Token = { type: "string" | "ident" | "word" | "number" | "punct"; value: string };
export type ImportCheck = { ok: true; table: string; rows: number } | { ok: false; reason: string };

const fail = (reason: string): ImportCheck => ({ ok: false, reason });

/** Splits the script into tokens, skipping comments. Throws on anything unexpected. */
const tokenize = (sql: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;
  while (i < sql.length) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (/\s/.test(ch)) { i++; continue; }

    // Comments: "-- ", "#" to end of line; /* ... */ (but never MySQL's executable /*! ... */)
    if ((ch === "-" && next === "-" && /\s/.test(sql[i + 2] ?? " ")) || ch === "#") {
      while (i < sql.length && sql[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      if (sql[i + 2] === "!") throw new Error("MySQL executable comments (/*! ... */) aren't allowed");
      const end = sql.indexOf("*/", i + 2);
      if (end < 0) throw new Error("Unclosed /* comment");
      i = end + 2;
      continue;
    }

    // Quoted strings ('...' or "..."), with \-escapes and doubled quotes
    if (ch === "'" || ch === '"') {
      let j = i + 1;
      for (;;) {
        if (j >= sql.length) throw new Error("Unclosed quoted text");
        if (sql[j] === "\\") { j += 2; continue; }
        if (sql[j] === ch) {
          if (sql[j + 1] === ch) { j += 2; continue; }
          break;
        }
        j++;
      }
      tokens.push({ type: "string", value: "" });
      i = j + 1;
      continue;
    }

    // `backtick` identifiers
    if (ch === "`") {
      const end = sql.indexOf("`", i + 1);
      if (end < 0) throw new Error("Unclosed ` identifier");
      tokens.push({ type: "ident", value: sql.slice(i + 1, end) });
      i = end + 1;
      continue;
    }

    // Numbers, including a leading minus right after "(" or ","
    const prev = tokens[tokens.length - 1];
    const signAllowed = ch === "-" && prev?.type === "punct" && (prev.value === "(" || prev.value === ",");
    const number = /^-?\d+(\.\d+)?([eE][+-]?\d+)?/.exec(sql.slice(i));
    if (number && (ch !== "-" || signAllowed)) {
      tokens.push({ type: "number", value: number[0] });
      i += number[0].length;
      continue;
    }

    const word = /^[A-Za-z_][A-Za-z0-9_$]*/.exec(sql.slice(i));
    if (word) {
      tokens.push({ type: "word", value: word[0] });
      i += word[0].length;
      continue;
    }

    if ("(),;.".includes(ch)) {
      tokens.push({ type: "punct", value: ch });
      i++;
      continue;
    }

    throw new Error(`Unexpected character "${ch}"`);
  }
  return tokens;
};

export const checkImportScript = (sql: string): ImportCheck => {
  if (typeof sql !== "string" || !sql.trim()) return fail("The script is empty");

  let tokens: Token[];
  try { tokens = tokenize(sql); } catch (error: any) { return fail(error.message); }

  let p = 0;
  const peek = () => tokens[p];
  const isWord = (t: Token | undefined, w: string) => t?.type === "word" && t.value.toLowerCase() === w;
  const isPunct = (t: Token | undefined, c: string) => t?.type === "punct" && t.value === c;
  const name = (t: Token | undefined) => (t && (t.type === "ident" || t.type === "word") ? t.value.toLowerCase() : null);

  if (!isWord(tokens[p++], "insert") || !isWord(tokens[p++], "into"))
    return fail("The script must start with INSERT INTO");

  // Table, optionally prefixed with the database name: `rtmdb`.`term`
  let table = name(tokens[p++]);
  if (isPunct(peek(), ".")) { p++; table = name(tokens[p++]); }
  if (!table || !ALLOWED[table]) return fail("Only the term and termline tables can be imported into");

  // Optional column list
  if (isPunct(peek(), "(")) {
    p++;
    for (;;) {
      const column = name(tokens[p++]);
      if (!column || !ALLOWED[table].includes(column)) return fail(`Unknown column for ${table}: ${column ?? "?"}`);
      if (isPunct(peek(), ",")) { p++; continue; }
      if (isPunct(peek(), ")")) { p++; break; }
      return fail("Malformed column list");
    }
  }

  if (!isWord(peek(), "values") && !isWord(peek(), "value")) return fail("Expected VALUES (only plain values can be imported)");
  p++;

  let rows = 0;
  for (;;) {
    if (!isPunct(tokens[p++], "(")) return fail("Each row must be in parentheses");
    for (;;) {
      const t = tokens[p++];
      const plain = t?.type === "string" || t?.type === "number" || (t?.type === "word" && PLAIN_VALUES.includes(t.value.toLowerCase()));
      const now = isWord(t, "now") && isPunct(tokens[p], "(") && isPunct(tokens[p + 1], ")");
      if (now) p += 2;
      else if (!plain) return fail(`Only plain values are allowed, found "${t?.value ?? "end of script"}"`);
      if (isPunct(peek(), ",")) { p++; continue; }
      if (isPunct(peek(), ")")) { p++; break; }
      return fail("Malformed row");
    }
    rows++;
    if (isPunct(peek(), ",")) { p++; continue; }
    break;
  }

  if (isPunct(peek(), ";")) p++;
  if (p < tokens.length) return fail("Only one INSERT statement is allowed per import");
  return { ok: true, table, rows };
};
