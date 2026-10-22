import { Platform } from 'react-native';
import { IndexChapter, IndexTerm } from '@/services/api';
import { WordBreakdown } from '@/utils/morphology';
import { clearSnapshot, loadShuffle, loadSnapshot, mergeDays, saveSnapshot, viewFrom, WIDGET_NAME, WidgetSnapshot, WidgetTerm } from './data';

// Called by the app to refresh the home-screen widget. Safe on iOS and on older builds
// without the widget installed: it quietly does nothing there.

export const redrawWidget = async () => {
  if (Platform.OS !== 'android') return;
  try {
    // Loaded lazily: the native part only exists in builds made after the widget was added.
    const { requestWidgetUpdate } = require('react-native-android-widget');
    const { renderTermWidget } = require('./TermWidget');
    const view = viewFrom(await loadSnapshot(), await loadShuffle());
    await requestWidgetUpdate({ widgetName: WIDGET_NAME, renderWidget: (info: any) => renderTermWidget(view, info) });
  } catch {
    // No widget support in this build.
  }
};

let lastSaved = '';

export const syncWidget = async ({ chapters, terms, unlocked, viewedSet, recent, daily, dailyBreakdown }: {
  chapters: IndexChapter[];
  terms: IndexTerm[];
  unlocked: Set<number>;
  viewedSet: Set<number>;
  recent: (WidgetTerm & { viewedAt: number })[];
  daily?: IndexTerm;
  dailyBreakdown?: WordBreakdown;
}) => {
  if (Platform.OS !== 'android') return;
  const pool = terms.filter((t) => unlocked.has(t.ChapterId));
  const parts = daily && dailyBreakdown?.parts.length
    ? { TermId: daily.TermId, parts: dailyBreakdown.parts.map((p) => [p.text, p.meaning] as [string, string?]), literal: dailyBreakdown.literal }
    : undefined;
  const viewedCount = pool.reduce((n, t) => n + (viewedSet.has(t.TermId) ? 1 : 0), 0);

  // Skip the write and redraw when nothing the widget shows has changed.
  const fingerprint = [pool.length, pool[0]?.TermId, viewedCount, recent.slice(0, 5).map((r) => `${r.TermId}@${r.viewedAt}`).join(','), parts?.TermId, parts?.parts.length, chapters.length].join('|');
  if (fingerprint === lastSaved) return;
  lastSaved = fingerprint;

  try {
    const previous = await loadSnapshot();
    const snapshot: WidgetSnapshot = {
      savedAt: Date.now(),
      chapters: Object.fromEntries(chapters.map((c) => [String(c.ChapterId), String(c.Title ?? '').trim()])),
      pool: pool.map((t) => [t.TermId, t.ChapterId, t.Term]),
      viewedCount,
      recent: recent.slice(0, 5).map((r) => ({ TermId: r.TermId, ChapterId: r.ChapterId, Term: r.Term })),
      // Keep yesterday's word parts only if they're still for today's term.
      dailyParts: parts ?? (previous?.dailyParts?.TermId === daily?.TermId ? previous?.dailyParts : undefined),
      days: mergeDays(previous?.days, recent.map((r) => r.viewedAt)),
    };
    await saveSnapshot(snapshot);
    await redrawWidget();
  } catch {
    lastSaved = '';
  }
};

// On sign-out the widget goes back to "Open the app to load your terms".
export const clearWidget = async () => {
  lastSaved = '';
  try {
    await clearSnapshot();
  } finally {
    await redrawWidget();
  }
};
