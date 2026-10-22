import { TermTables } from "@/types";
import { termApi } from "@/services/api";
import { useApiQuery } from "../useApiQuery";

const EMPTY: TermTables = [];
const byTermName = (a: any, b: any) =>
    String(a?.Term ?? '').trim().toLowerCase().localeCompare(String(b?.Term ?? '').trim().toLowerCase(), undefined, {
        sensitivity: 'base',
        numeric: true,
        ignorePunctuation: true,
    });

export const useGetAllTerms = (ChapterId: number, UserId: number) => {
    const { data, loading, error, refetch } = useApiQuery(
        async (signal) => [...((await termApi.getAllByChapter(ChapterId, UserId, signal)) ?? [])].sort(byTermName),
        [ChapterId, UserId],
        { enabled: ChapterId !== 0 && UserId !== 0, initialData: EMPTY },
    );
    return { records: data, loading, error, refetch };
};
