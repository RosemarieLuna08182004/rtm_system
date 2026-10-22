// Typo-tolerant term search used by the global search screen.
// Ranking: exact > starts with > a word starts with > contains > close spelling (1–2 typos).

export interface SearchResult<T> {
  item: T;
  score: number;
  fuzzy: boolean;   // matched only by close spelling
}

export const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')   // accents: é → e
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Edit distance with adjacent swaps ("teh" → "the" counts as one), stopping early past `max`.
const editDistance = (a: string, b: string, max: number): number => {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev2: number[] = new Array(b.length + 1).fill(0);
  let prev: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur: number[] = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) value = Math.min(value, prev2[j - 2] + 1);
      cur[j] = value;
      rowMin = Math.min(rowMin, value);
    }
    if (rowMin > max) return max + 1;
    for (let j = 0; j <= b.length; j++) prev2[j] = prev[j];
    prev = cur;
  }
  return prev[b.length];
};

const allowedTypos = (length: number) => (length >= 8 ? 2 : length >= 4 ? 1 : 0);

export const searchItems = <T>(items: T[], query: string, getText: (item: T) => string, limit = 60): SearchResult<T>[] => {
  const q = normalizeText(query);
  if (!q) return [];
  const qCompact = q.replace(/ /g, '');
  const maxTypos = allowedTypos(qCompact.length);
  const results: SearchResult<T>[] = [];

  for (const item of items) {
    const text = normalizeText(getText(item));
    if (!text) continue;
    let score = 0;
    let fuzzy = false;

    if (text === q) score = 100;
    else if (text.startsWith(q)) score = 90;
    else if (text.split(' ').some((word) => word.startsWith(q))) score = 80;
    else if (text.includes(q) || text.replace(/ /g, '').includes(qCompact)) score = 60;
    else if (maxTypos > 0) {
      // Compare with the same-length start of the term and of each word.
      const candidates = [text.replace(/ /g, ''), ...text.split(' ')];
      let best = maxTypos + 1;
      for (const candidate of candidates) {
        if (candidate.length < qCompact.length - maxTypos) continue;
        best = Math.min(best,
          editDistance(qCompact, candidate.slice(0, qCompact.length), maxTypos),
          editDistance(qCompact, candidate, maxTypos));
        if (best === 0) break;
      }
      if (best <= maxTypos) { score = 40 - best * 10; fuzzy = true; }
    }

    if (score > 0) results.push({ item, score: score - Math.min(text.length, 60) / 100, fuzzy });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
};
