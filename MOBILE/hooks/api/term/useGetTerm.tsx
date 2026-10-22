import { TermTableInitial } from "@/shared";
import { TermTable } from "@/types";
import { termApi } from "@/services/api";
import { useApiQuery } from "../useApiQuery";

export const useGetTerm = (TermId: number, UserId: number) => {
    const { data, loading, error, refetch } = useApiQuery<TermTable>(
        async (signal) => (await termApi.get(TermId, UserId, signal)) ?? TermTableInitial,
        [TermId, UserId],
        { enabled: TermId !== 0 && UserId !== 0, initialData: TermTableInitial },
    );
    return { records: data, loading, error, refetch };
};
