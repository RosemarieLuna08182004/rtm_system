import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface BookmarkState {
  [key: string]: boolean; // key format: "termId_userId" -> bookmark status
}

interface BookmarkContextType {
  bookmarkState: BookmarkState;
  bookmarkVersion: number; // Increments on each bookmark state change
  lastChangeType: 'add' | 'remove' | null; // Track the type of the last change
  updateBookmarkStatus: (termId: number, userId: number, isBookmarked: boolean) => void;
  getBookmarkStatus: (termId: number, userId: number) => boolean | undefined;
  clearBookmarkState: () => void;
  incrementBookmarkVersion: (changeType?: 'add' | 'remove') => void; // Function to manually trigger a version update
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

interface BookmarkProviderProps {
  children: ReactNode;
}

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
  const [bookmarkState, setBookmarkState] = useState<BookmarkState>({});
  const [bookmarkVersion, setBookmarkVersion] = useState(0);
  const [lastChangeType, setLastChangeType] = useState<'add' | 'remove' | null>(null);

  const updateBookmarkStatus = useCallback((termId: number, userId: number, isBookmarked: boolean) => {
    const key = `${termId}_${userId}`;
    setBookmarkState(prev => {
      // Only update if the value is different
      if (prev[key] === isBookmarked) return prev;
      return {
        ...prev,
        [key]: isBookmarked
      };
    });
  }, []);

  // Increment the version number to signal that bookmarks have changed
  const incrementBookmarkVersion = useCallback((changeType: 'add' | 'remove' = 'add') => {
    setBookmarkVersion(prev => prev + 1);
    setLastChangeType(changeType);
  }, []);

  const getBookmarkStatus = useCallback((termId: number, userId: number): boolean | undefined => {
    const key = `${termId}_${userId}`;
    return bookmarkState[key];
  }, [bookmarkState]);

  const clearBookmarkState = useCallback(() => {
    setBookmarkState({});
  }, []);

  // A new or ended session must not see the previous user's bookmark state.
  const { auth } = useAuth();
  const userId = auth?.user?.Id ?? 0;
  useEffect(() => {
    setBookmarkState({});
    setLastChangeType(null);
  }, [userId, auth?.accessToken ? 1 : 0]);

  const value: BookmarkContextType = {
    bookmarkState,
    bookmarkVersion,
    lastChangeType,
    updateBookmarkStatus,
    getBookmarkStatus,
    clearBookmarkState,
    incrementBookmarkVersion,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarkContext = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarkContext must be used within a BookmarkProvider');
  }
  return context;
};
