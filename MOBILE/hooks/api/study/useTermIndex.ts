import { useCallback, useEffect, useMemo, useState } from "react";
import { IndexChapter, IndexTerm, studyApi, TermIndex } from "@/services/api";
import { errorMessageFrom } from "@/utils/errors";
import { useAuth } from "../../useAuth";

// One shared, cached copy of the term index for Home, Search and progress.
// It is small (~3,000 short rows), so it is loaded once and reused for a few minutes.
const FRESH_FOR_MS = 5 * 60 * 1000;
let cache: { userId: number; at: number; data: TermIndex } | null = null;
let inFlight: { userId: number; promise: Promise<TermIndex> } | null = null;

const loadIndex = (userId: number, force: boolean): Promise<TermIndex> => {
  if (!force && cache && cache.userId === userId && Date.now() - cache.at < FRESH_FOR_MS) return Promise.resolve(cache.data);
  if (inFlight && inFlight.userId === userId) return inFlight.promise;
  const promise = studyApi.getIndex()
    .then((data) => {
      const safe: TermIndex = { chapters: data?.chapters ?? [], terms: data?.terms ?? [] };
      cache = { userId, at: Date.now(), data: safe };
      return safe;
    })
    .finally(() => { inFlight = null; });
  inFlight = { userId, promise };
  return promise;
};

export interface TermIndexView {
  chapters: IndexChapter[];
  terms: IndexTerm[];
  chapterById: Map<number, IndexChapter>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTermIndex = (): TermIndexView => {
  const { auth } = useAuth();
  const userId: number = auth?.user?.Id ?? 0;
  const initial = cache && cache.userId === userId ? cache.data : null;
  const [data, setData] = useState<TermIndex | null>(initial);
  const [loading, setLoading] = useState<boolean>(!initial && !!userId);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (force: boolean) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      setData(await loadIndex(userId, force));
    } catch (err) {
      setError(errorMessageFrom(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { run(false); }, [run]);

  const chapters = data?.chapters ?? [];
  const terms = data?.terms ?? [];
  const chapterById = useMemo(() => new Map(chapters.map((c) => [c.ChapterId, c])), [chapters]);

  return { chapters, terms, chapterById, loading, error, refetch: () => run(true) };
};

// Forget the cached index (e.g. after buying a volume, so lock status refreshes).
export const clearTermIndexCache = () => { cache = null; };
