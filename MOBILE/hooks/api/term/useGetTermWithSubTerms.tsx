import { API } from "@/constants";
import { useAxiosPrivate } from "../../useAxiosPrivate";
import { Error, ErrorTitle, TermTableInitial } from "@/shared";
import { TermTable, TermLineTables } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseGetTermWithSubTermsReturn {
  term: TermTable;
  subterms: TermLineTables;
  loading: boolean;
  termLoading: boolean;
  subtermsLoading: boolean;
  refetch: () => Promise<void>;
  refetchTerm: () => Promise<void>;
  refetchSubTerms: () => Promise<void>;
}

export const useGetTermWithSubTerms = (TermId: number, UserId: number): UseGetTermWithSubTermsReturn => {
  const axios = useAxiosPrivate();
  const [term, setTerm] = useState<TermTable>(TermTableInitial);
  const [subterms, setSubterms] = useState<TermLineTables>([]);
  const [termLoading, setTermLoading] = useState<boolean>(true);
  const [subtermsLoading, setSubtermsLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(true);

  const fetchTerm = useCallback(async () => {
    if (!isMounted) return;
    setTermLoading(true);
    try {
      const response = await axios.get(`${API}/user/term/get-term/${TermId}/${UserId}`);
      if (isMounted) {
        setTerm(response.data.data[0]);
      }
    } catch (error: any) {
      if (isMounted) {
        setTerm(TermTableInitial);
        Alert.alert(ErrorTitle.m0001, Error.m0001);
      }
    } finally {
      if (isMounted) {
        setTermLoading(false);
      }
    }
  }, [axios, TermId, UserId, isMounted]);

  const fetchSubTerms = useCallback(async () => {
    if (!isMounted) return;
    setSubtermsLoading(true);
    try {
      const response = await axios.get(`${API}/term/line/get-all/${TermId}`);
      if (isMounted) {
        setSubterms(response.data.data);
      }
    } catch (error: any) {
      if (isMounted) {
        setSubterms([]);
        Alert.alert(ErrorTitle.m0001, Error.m0001);
      }
    } finally {
      if (isMounted) {
        setSubtermsLoading(false);
      }
    }
  }, [axios, TermId, isMounted]);

  // Optimized function to fetch both term and subterms concurrently
  const fetchBoth = useCallback(async () => {
    if (UserId === 0 || TermId === 0 || !isMounted) return;

    setTermLoading(true);
    setSubtermsLoading(true);

    try {
      // Fetch both concurrently for better performance
      const [termResponse, subtermsResponse] = await Promise.all([
        axios.get(`${API}/user/term/get-term/${TermId}/${UserId}`),
        axios.get(`${API}/term/line/get-all/${TermId}`)
      ]);

      if (isMounted) {
        setTerm(termResponse.data.data[0]);
        setSubterms(subtermsResponse.data.data);
      }
    } catch (error: any) {
      if (isMounted) {
        setTerm(TermTableInitial);
        setSubterms([]);
        Alert.alert(ErrorTitle.m0001, Error.m0001);
      }
    } finally {
      if (isMounted) {
        setTermLoading(false);
        setSubtermsLoading(false);
      }
    }
  }, [axios, TermId, UserId, isMounted]);

  useEffect(() => {
    if (UserId !== 0 && TermId !== 0) {
      fetchBoth();
    }
  }, [TermId, UserId, fetchBoth]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  const loading = termLoading || subtermsLoading;

  return {
    term,
    subterms,
    loading,
    termLoading,
    subtermsLoading,
    refetch: fetchBoth,
    refetchTerm: fetchTerm,
    refetchSubTerms: fetchSubTerms,
  };
};
