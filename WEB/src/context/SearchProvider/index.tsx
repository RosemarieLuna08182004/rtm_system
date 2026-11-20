import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface SearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType>({
    searchQuery: '',
    setSearchQuery: () => {},
});

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { pathname } = useLocation();

    // Clear the search on every page change. Done here rather than in the top bar,
    // which only shows on the Dashboard, so a query typed there can't silently
    // filter the next page.
    useEffect(() => {
        setSearchQuery('');
    }, [pathname]);

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);
