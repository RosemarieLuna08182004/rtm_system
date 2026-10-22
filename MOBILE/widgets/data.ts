import AsyncStorage from '@react-native-async-storage/async-storage';
import { dayIndex, dayKey } from '@/utils/termOfTheDay';

// What the home-screen widget shows. The app saves it whenever Home loads, and the widget
// reads it in the background (it never calls the API itself, so it needs no sign-in token).

export const WIDGET_NAME = 'TermOfTheDay';
export const SCHEME = 'roots-and-morphology';
const KEY = 'widget.snapshot.v1';
const SHUFFLE_KEY = 'widget.shuffle.v1';
const MAX_DAYS = 120;

export interface WidgetTerm {
  TermId: number;
  ChapterId: number;
  Term: string;
}

export interface WidgetParts {
  TermId: number;
  parts: [string, string?][];               // [text, meaning], e.g. ["Ren", "the kidney"]
  literal?: string;
}

export interface WidgetSnapshot {
  savedAt: number;
  chapters: Record<string, string>;          // ChapterId → volume title
  pool: [number, number, string][];          // unlocked terms as [TermId, ChapterId, Term], Home's order
  viewedCount?: number;                      // unlocked terms opened at least once
  recent?: WidgetTerm[];                     // last terms viewed, newest first
  dailyParts?: WidgetParts;                  // word parts of today's term
  days?: string[];                           // days you studied ("YYYY-MM-DD"), for the streak
  last?: WidgetTerm;                         // last term viewed (kept for older snapshots)
}

export type ViewTerm = WidgetTerm & { volume: string };

export interface WidgetView {
  daily?: ViewTerm & { parts?: WidgetParts; isToday: boolean };
  recent: ViewTerm[];
  viewed: number;
  total: number;
  streak: number;
  studiedToday: boolean;
}

export const saveSnapshot = (snapshot: WidgetSnapshot) => AsyncStorage.setItem(KEY, JSON.stringify(snapshot));
export const clearSnapshot = () => Promise.all([AsyncStorage.removeItem(KEY), AsyncStorage.removeItem(SHUFFLE_KEY)]);

export const loadSnapshot = async (): Promise<WidgetSnapshot | null> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WidgetSnapshot) : null;
  } catch {
    return null;
  }
};

// "Another term" on the widget moves through the list; it starts again at today's term each day.
export const loadShuffle = async (): Promise<number> => {
  try {
    const saved = JSON.parse((await AsyncStorage.getItem(SHUFFLE_KEY)) ?? 'null');
    return saved?.day === dayKey() ? Number(saved.offset) || 0 : 0;
  } catch {
    return 0;
  }
};
export const saveShuffle = (offset: number) => AsyncStorage.setItem(SHUFFLE_KEY, JSON.stringify({ day: dayKey(), offset }));

// Adds the days found in recently viewed terms to the saved list.
export const mergeDays = (saved: string[] | undefined, viewedAt: number[]): string[] => {
  const all = new Set([...(saved ?? []), ...viewedAt.map((at) => dayKey(new Date(at)))]);
  return [...all].sort().slice(-MAX_DAYS);
};

// Consecutive study days ending today (or yesterday, so the streak survives until tonight).
const streakFrom = (days: string[]): number => {
  const set = new Set(days);
  const cursor = new Date();
  if (!set.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(dayKey(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
};

// Today's term is worked out from the saved list, so it changes at midnight even if the app stays closed.
export const viewFrom = (snapshot: WidgetSnapshot | null, shuffle = 0): WidgetView | null => {
  if (!snapshot) return null;
  const pool = snapshot.pool ?? [];
  const volume = (chapterId: number) => snapshot.chapters?.[String(chapterId)] ?? '';
  const picked = pool.length ? pool[(dayIndex(pool.length) + shuffle) % pool.length] : undefined;
  const recent = (snapshot.recent ?? (snapshot.last ? [snapshot.last] : [])).map((t) => ({ ...t, volume: volume(t.ChapterId) }));
  const days = snapshot.days ?? [];
  return {
    daily: picked
      ? {
          TermId: picked[0], ChapterId: picked[1], Term: picked[2], volume: volume(picked[1]),
          parts: snapshot.dailyParts?.TermId === picked[0] ? snapshot.dailyParts : undefined,
          isToday: shuffle % Math.max(pool.length, 1) === 0,
        }
      : undefined,
    recent,
    viewed: Math.min(snapshot.viewedCount ?? 0, pool.length),
    total: pool.length,
    streak: streakFrom(days),
    studiedToday: days.includes(dayKey()),
  };
};

export const termLink = (term: WidgetTerm) => `${SCHEME}://term-line?ChapterId=${term.ChapterId}&TermId=${term.TermId}`;
export const SEARCH_LINK = `${SCHEME}://search`;
export const BOOKMARKS_LINK = `${SCHEME}://bookmark`;
