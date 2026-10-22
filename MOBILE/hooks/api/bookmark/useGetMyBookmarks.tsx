import { bookmarkApi, BookmarkGroup } from "@/services/api";
import { useApiQuery } from "../useApiQuery";

export type { BookmarkGroup, BookmarkedTerm } from "@/services/api";

const EMPTY: BookmarkGroup[] = [];

// All of the signed-in user's bookmarks, grouped by chapter, in a single request.
export const useGetMyBookmarks = (UserId: number) => {
    const { data, loading, refreshing, error, refetch } = useApiQuery(
        (signal) => bookmarkApi.getMine(signal),
        [UserId],
        { enabled: !!UserId, initialData: EMPTY },
    );
    return { groups: data, loading, refreshing, error, refetch };
};
