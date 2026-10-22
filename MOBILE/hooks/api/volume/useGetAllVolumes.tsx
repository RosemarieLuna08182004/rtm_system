import { ChapterTables } from "@/types";
import { chapterApi } from "@/services/api";
import { useApiQuery } from "../useApiQuery";

const EMPTY: ChapterTables = [];

export const useGetAllVolumes = (UserId: number) => {
    const { data, loading, error, refetch } = useApiQuery(
        (signal) => chapterApi.getAll(UserId, signal),
        [UserId],
        { enabled: UserId !== 0, initialData: EMPTY },
    );
    return { records: data, loading, error, refetch };
};
