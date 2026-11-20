import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AttentionFilter } from "../utils/attention";

/**
 * Reads the filter sent by a Needs Attention "View all" link (router state), so a
 * list page can show only the flagged records. Router state lives in browser history,
 * so the filter survives a page reload; opening the page from the menu shows everything.
 */
export const useAttentionFilter = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const filter = (location.state as { attention?: AttentionFilter } | null)?.attention ?? null;

    const idSet = useMemo(() => (filter ? new Set(filter.ids.map(String)) : null), [filter]);

    const applyFilter = useCallback(
        <T extends { Id?: string | number }>(rows: T[]): T[] => (idSet ? rows.filter(row => idSet.has(String(row.Id))) : rows),
        [idSet]
    );

    const clearFilter = useCallback(
        () => navigate(location.pathname, { replace: true, state: null }),
        [navigate, location.pathname]
    );

    return { filter, applyFilter, clearFilter };
};
