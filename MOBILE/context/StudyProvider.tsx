import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getItem, setItem } from '@/utils/asyncStorage';

// Per-account study data kept on this device: viewed terms (progress), recently viewed
// terms ("Continue where you left off"), personal notes and recent searches.

export interface RecentTerm {
  TermId: number;
  ChapterId: number;
  Term: string;
  viewedAt: number;
}

export interface TermNote {
  text: string;
  updatedAt: number;
}

interface StudyData {
  viewed: number[];
  recent: RecentTerm[];
  notes: Record<string, TermNote>;
  searches: string[];
}

interface StudyContextType extends StudyData {
  loaded: boolean;
  viewedSet: Set<number>;
  recordView: (term: Omit<RecentTerm, 'viewedAt'>) => void;
  saveNote: (TermId: number, text: string) => void;
  addSearch: (query: string) => void;
  clearSearches: () => void;
}

const EMPTY: StudyData = { viewed: [], recent: [], notes: {}, searches: [] };
const MAX_RECENT = 10;
const MAX_SEARCHES = 8;
const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  const userId: number = auth?.user?.Id ?? 0;
  const storageKey = userId ? `study.v1.${userId}` : '';
  const [data, setData] = useState<StudyData>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load this account's data whenever the signed-in user changes.
  useEffect(() => {
    let active = true;
    setLoaded(false);
    setData(EMPTY);
    if (!storageKey) return;
    (async () => {
      try {
        const saved = await getItem(storageKey);
        const parsed = saved ? JSON.parse(saved) : null;
        if (active && parsed) {
          setData({
            viewed: Array.isArray(parsed.viewed) ? parsed.viewed : [],
            recent: Array.isArray(parsed.recent) ? parsed.recent : [],
            notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
            searches: Array.isArray(parsed.searches) ? parsed.searches : [],
          });
        }
      } catch {
        // Start fresh if the saved data can't be read.
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => { active = false; };
  }, [storageKey]);

  // Save shortly after changes (batches quick successive updates).
  const update = useCallback((change: (prev: StudyData) => StudyData) => {
    setData((prev) => {
      const next = change(prev);
      if (storageKey) {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => setItem(storageKey, JSON.stringify(next)), 400);
      }
      return next;
    });
  }, [storageKey]);

  const recordView = useCallback((term: Omit<RecentTerm, 'viewedAt'>) => {
    if (!term.TermId) return;
    update((prev) => ({
      ...prev,
      viewed: prev.viewed.includes(term.TermId) ? prev.viewed : [...prev.viewed, term.TermId],
      recent: [{ ...term, viewedAt: Date.now() }, ...prev.recent.filter((r) => r.TermId !== term.TermId)].slice(0, MAX_RECENT),
    }));
  }, [update]);

  const saveNote = useCallback((TermId: number, text: string) => {
    update((prev) => {
      const notes = { ...prev.notes };
      if (text.trim()) notes[String(TermId)] = { text: text.trim(), updatedAt: Date.now() };
      else delete notes[String(TermId)];
      return { ...prev, notes };
    });
  }, [update]);

  const addSearch = useCallback((query: string) => {
    const q = query.trim();
    if (q.length < 2) return;
    update((prev) => ({
      ...prev,
      searches: [q, ...prev.searches.filter((s) => s.toLowerCase() !== q.toLowerCase())].slice(0, MAX_SEARCHES),
    }));
  }, [update]);

  const clearSearches = useCallback(() => update((prev) => ({ ...prev, searches: [] })), [update]);

  const value = useMemo<StudyContextType>(() => ({
    ...data,
    loaded,
    viewedSet: new Set(data.viewed),
    recordView,
    saveNote,
    addSearch,
    clearSearches,
  }), [data, loaded, recordView, saveNote, addSearch, clearSearches]);

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
};

export const useStudy = (): StudyContextType => {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used within a StudyProvider');
  return context;
};
