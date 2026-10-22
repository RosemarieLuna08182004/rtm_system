// Picks the same item for everyone on a given day (changes at midnight).
// Shared by Home ("Today's focus") and the home-screen widget so they always match.
export const dayIndex = (length: number, date: Date = new Date()): number => {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  let hash = seed;
  for (let i = 0; i < 5; i++) hash = (hash * 1103515245 + 12345) % 2147483648;
  return length ? hash % length : 0;
};

export const pickForDay = <T,>(pool: T[], date: Date = new Date()): T | undefined =>
  pool.length ? pool[dayIndex(pool.length, date)] : undefined;

// Local calendar day as "YYYY-MM-DD".
export const dayKey = (date: Date = new Date()): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
