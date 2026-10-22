import { useCallback, useEffect, useRef } from "react";
import axios from "axios";

// Gives each request an AbortSignal. Starting a new request cancels the previous one,
// and leaving the screen cancels whatever is still running.
export const useCancelableRequest = () => {
  const controllerRef = useRef<AbortController | null>(null);

  const start = useCallback((): AbortSignal => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    return controllerRef.current.signal;
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return start;
};

export const isCanceled = (error: unknown): boolean => axios.isCancel(error);
