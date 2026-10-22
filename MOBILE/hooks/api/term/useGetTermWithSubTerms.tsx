import { TermTableInitial } from "@/shared";
import { TermTable, TermLineTables } from "@/types";
import { termApi } from "@/services/api";
import { useApiQuery } from "../useApiQuery";

interface TermWithSubTerms {
  term: TermTable;
  subterms: TermLineTables;
}

const EMPTY: TermWithSubTerms = { term: TermTableInitial, subterms: [] };

// Term and its sub-terms, fetched together.
export const useGetTermWithSubTerms = (TermId: number, UserId: number) => {
  const { data, loading, error, refetch } = useApiQuery<TermWithSubTerms>(
    async (signal) => {
      const [term, subterms] = await Promise.all([
        termApi.get(TermId, UserId, signal),
        termApi.getSubTerms(TermId, signal),
      ]);
      return { term: term ?? TermTableInitial, subterms: subterms ?? [] };
    },
    [TermId, UserId],
    { enabled: TermId !== 0 && UserId !== 0, initialData: EMPTY },
  );

  return {
    term: data.term,
    subterms: data.subterms,
    loading,
    error,
    refetch,
  };
};
