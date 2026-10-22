import { useCallback, useEffect, useRef, useState } from "react";
import { errorMessageFrom } from "@/utils/errors";
import { isCanceled, useCancelableRequest } from "../useCancelableRequest";

interface Options<T> {
  // Skip fetching (e.g. while an Id is still 0).
  enabled: boolean;
  initialData: T;
}

// Shared fetch logic for screens: loading/refreshing/error state, cancels the previous
// request when inputs change or the screen closes, and ignores canceled requests.
export const useApiQuery = <T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: ReadonlyArray<unknown>,
  { enabled, initialData }: Options<T>,
) => {
  const startRequest = useCancelableRequest();
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const initialRef = useRef(initialData);

  const refetch = useCallback(async (isRefresh: boolean = false) => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    const signal = startRequest();
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const result = await fetcher(signal);
      setData(result ?? initialRef.current);
    } catch (err) {
      if (isCanceled(err)) return;
      setData(initialRef.current);
      setError(errorMessageFrom(err));
    }
    if (!signal.aborted) {
      setLoading(false);
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, startRequest, ...deps]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, refreshing, error, refetch };
};
