import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

interface SearchOptions<T> {
  data: T[];
  searchKeys: (keyof T)[];
  delay?: number;
}

const normalize = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

export function useSearch<T>({ data, searchKeys, delay = 150 }: SearchOptions<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Bypass debounce for empty queries - return data immediately
  // Use debounce only when there's actually a search query
  const debouncedQuery = useDebounce(searchQuery, searchQuery.trim() ? delay : 0);

  const filteredData = useMemo(() => {
    const trimmedQuery = debouncedQuery.trim();
    if (!trimmedQuery) return data;

    const normalizedQuery = normalize(trimmedQuery);
    const startsWith: T[] = [];
    const includes: T[] = [];

    for (const item of data) {
      let isStart = false;
      let foundMatch = false;

      for (const key of searchKeys) {
        const value = item[key];
        if (typeof value !== 'string' || !value) continue;

        const normalizedValue = normalize(value);
        if (!normalizedValue) continue;

        if (normalizedValue.startsWith(normalizedQuery)) {
          isStart = true;
          foundMatch = true;
          break; // Early exit: no need to check other keys if we found a startsWith match
        } else if (!foundMatch && normalizedValue.includes(normalizedQuery)) {
          foundMatch = true;
        }
      }

      if (isStart) {
        startsWith.push(item);
      } else if (foundMatch) {
        includes.push(item);
      }
    }

    return [...startsWith, ...includes];
  }, [data, debouncedQuery, searchKeys]);

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    filteredData,
  };
}
