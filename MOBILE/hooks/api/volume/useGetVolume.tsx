import { ChapterTableInitial } from "@/shared";
import { ChapterTable } from "@/types";
import { chapterApi } from "@/services/api";
import { useApiQuery } from "../useApiQuery";

export const useGetVolume = (ChapterId: number, UserId: number) => {
    const { data, loading, error, refetch } = useApiQuery<ChapterTable>(
        async (signal) => (await chapterApi.get(ChapterId, UserId, signal)) ?? ChapterTableInitial,
        [ChapterId, UserId],
        { enabled: ChapterId !== 0 && UserId !== 0, initialData: ChapterTableInitial },
    );
    return { records: data, loading, error, refetch };
};
