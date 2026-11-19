import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StyleSheet, RefreshControl, Dimensions, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter, useFocusEffect } from 'expo-router';
import { BookmarkOutlineIcon } from '@/constants';
import { AnimatedSearch } from '@/components/Filters/SearchFilter';

// Memoized BookmarkTermButton to prevent unnecessary re-renders
const MemoizedBookmarkTermButton = React.memo(({ Text, OnPress, Status, data, IsChapter, Disabled, OnUnbookmark }: any) => (
  <BookmarkTermButton 
    Text={Text}
    OnPress={OnPress}
    Status={Status}
    data={data}
    IsChapter={IsChapter}
    Disabled={Disabled}
    OnUnbookmark={OnUnbookmark}
  />
));

MemoizedBookmarkTermButton.displayName = 'MemoizedBookmarkTermButton';
import * as S from '@/styles';
import { ActivityIndicator, Header } from '@/components';
import { RequireAuth, useBookmarkContext } from '@/context';
import { useAuth, useToggle, useGetAllBookmark } from '@/hooks';
import { TermTable } from '@/types/tables';
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';
import { API, RoutesChannel } from '@/constants';
import { BookmarkTermButton } from '@/components/FormInputs';
import { TermStatus } from '@/types/components/status';
import { responsiveDimension } from '@/utils';

interface Chapter {
  Id: number;
  Title: string;
  ChapterId: number;
  Status: string;
}

interface TermWithChapter extends Omit<TermTable, 'Status' | 'TermId' | 'UserTermsId'> {
  chapterTitle: string;
  Status: TermStatus | string;
  TermId: number;
  UserTermsId: number;
  ChapterId: number;
}

interface ChapterSection {
  title: string;
  data: TermWithChapter[];
  chapterId: number;
  sortTitle?: string;
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: '100%',
  },
  emptyContent: {
    justifyContent: 'center',
    marginBottom: 30,
    width: '100%',
    paddingVertical: 40,
  },
  iconContainer: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1f2937',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 24,
  },
  instructionsContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  instructionsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#111827',
    marginBottom: 16,
    width: '100%',
    textAlign: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    width: '100%',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    alignSelf: 'flex-start',
    marginTop: 2,
    flexShrink: 0,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  stepText: {
    flex: 1,
    color: '#4b5563',
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
    paddingTop: 3,
  },
});

export default function Bookmark() {
  const router = useRouter();
  const { auth } = useAuth();
  const axios = useAxiosPrivate();
  const UserId = auth?.user?.Id ?? 0;
  const { records: chapters = [], refetch, loading } = useGetAllBookmark({ UserId });
  const [sections, setSections] = useState<ChapterSection[]>([]);
  const [loadingState, setLoadingState] = useState<'idle' | 'initial' | 'refreshing' | 'fetching'>('initial');
  const { updateBookmarkStatus, bookmarkVersion, lastChangeType } = useBookmarkContext();
  const [lastBookmarkVersion, setLastBookmarkVersion] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasCompletedInitialLoad, setHasCompletedInitialLoad] = useState(false);
  const [hasBookmarksInDatabase, setHasBookmarksInDatabase] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalFilteredCount, setTotalFilteredCount] = useState(0);


  const { height } = Dimensions.get('window');
  const responsivePaddingBottom = height * 0.15;

  // Optimized flattening of sections data with useMemo
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      setTotalFilteredCount(sections.reduce((sum, s) => sum + s.data.length, 0));
      return sections;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = sections
      .map(section => ({
        ...section,
        data: section.data.filter(term => 
          term.Term.toLowerCase().includes(query)
        )
      }))
      .filter(section => section.data.length > 0);
    
    setTotalFilteredCount(filtered.reduce((sum, s) => sum + s.data.length, 0));
    return filtered;
  }, [sections, searchQuery]);

  const flatListData = useMemo(() => {
    const result: Array<{type: 'header', title: string, id: string, count: number} | {type: 'item', item: TermWithChapter, id: string}> = [];
    
    for (let i = 0; i < filteredSections.length; i++) {
      const section = filteredSections[i];
      // Add section header with count
      result.push({
        type: 'header',
        title: section.title,
        id: `header-${section.chapterId}`,
        count: section.data.length
      });
      
      // Add section items
      const { data } = section;
      for (let j = 0; j < data.length; j++) {
        const item = data[j];
        result.push({
          type: 'item',
          item,
          id: `item-${item.TermId}-${item.ChapterId}`
        });
      }
    }
    
    return result;
  }, [filteredSections]);

  // Define item types for better type safety
  type ListItem = 
    | { type: 'header'; title: string; id: string; count: number }
    | { type: 'item'; item: TermWithChapter; id: string };

  // Optimized removal function for immediate UI update
  const handleRemoveBookmark = useCallback((termId: number, chapterId: number) => {
    setSections(prevSections => {
      const updatedSections = prevSections.map(section => {
        if (section.chapterId === chapterId) {
          const filteredData = section.data.filter(term => term.TermId !== termId);
          return { ...section, data: filteredData };
        }
        return section;
      }).filter(section => section.data.length > 0); // Remove empty sections
      
      // Update hasBookmarksInDatabase if no sections left
      if (updatedSections.length === 0) {
        setHasBookmarksInDatabase(false);
      }
      
      return updatedSections;
    });
  }, []);

  // Optimized renderItem with proper typing and memoization
  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    if (item.type === 'header') {
      return (
        <S.View className="px-4 py-3" style={styles.sectionHeader}>
          <S.Text style={styles.sectionHeaderText}>{item.title}</S.Text>
        </S.View>
      );
    } 
    
    if (item.type === 'item' && item.item) {
      const { item: term } = item;
      return (
        <S.View className="px-4">
          <MemoizedBookmarkTermButton
            Text={term.Term}
            OnPress={() => {
              router.push({
                pathname: RoutesChannel.TERM_LINE,
                params: { 
                  ChapterId: term.ChapterId, 
                  TermId: term.TermId 
                },
              });
            }}
            Status={term.Status as TermStatus}
            data={{ 
              TermId: term.TermId, 
              UserTermsId: term.UserTermsId 
            }}
            IsChapter={false}
            Disabled={false}
            OnUnbookmark={() => handleRemoveBookmark(term.TermId, term.ChapterId)}
          />
        </S.View>
      );
    }
    
    return null;
  }, [router, handleRemoveBookmark]);

  // Optimized key extractor for FlashList
  const keyExtractor = useCallback((item: ListItem) => item.id, []);

  // Estimate item sizes for better performance (in pixels)
  const getItemSize = useCallback((item: ListItem) => {
    return item.type === 'header' ? 50 : 80; // Adjust based on your actual item heights
  }, []);

  // Function to help FlashList recycle components efficiently
  const getItemType = useCallback((item: ListItem) => {
    return item.type; // 'header' or 'item'
  }, []);


  const fetchBookmarkedTerms = async (isRefresh = false) => {
    if (!Array.isArray(chapters) || chapters.length === 0) {
      setSections([]);
      setHasBookmarksInDatabase(false);
      setHasCompletedInitialLoad(true);
      setLoadingState('idle');
      return;
    }

    // Prevent concurrent fetches
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    setLoadingState(isRefresh ? 'refreshing' : 'fetching');
    
    // Reset bookmark detection state when starting fresh fetch
    if (!isRefresh) {
      setHasBookmarksInDatabase(null);
    }
    
    try {
      // First sort chapters alphabetically by title
      const sortedChapters = [...chapters as unknown as Chapter[]].sort((a, b) => 
        (a.Title || `Chapter ${a.ChapterId}`).toLowerCase().localeCompare(
          (b.Title || `Chapter ${b.ChapterId}`).toLowerCase()
        )
      );

      const chapterPromises = sortedChapters.map(async (chapter) => {
        try {
          const response = await axios.get(
            `${API}/user/term/get-all-bookmark/${UserId}/${chapter.ChapterId}`
          );

          const terms = (response.data?.data || []).map((term: TermTable) => ({
            ...term,
            chapterTitle: chapter.Title || `Chapter ${chapter.ChapterId}`,
            ChapterId: chapter.ChapterId,
          }));

          // Sort terms alphabetically with case-insensitive comparison, trimming whitespace
          const sortedTerms = [...terms].sort((a, b) =>
            a.Term.trim().toLowerCase().localeCompare(b.Term.trim().toLowerCase())
          );
          
          return {
            title: chapter.Title || `Chapter ${chapter.ChapterId}`,
            data: sortedTerms,
            chapterId: chapter.ChapterId,
            sortTitle:
              chapter.Title?.toLowerCase() ||
              `chapter ${chapter.ChapterId.toString().padStart(5, '0')}`,
          };
        } catch (error) {
          return null;
        }
      });

      let chapterSections = (await Promise.all(chapterPromises)).filter(
        (section): section is ChapterSection & { sortTitle: string } =>
          section !== null && section.data.length > 0
      );

      // Sort sections by chapter title with case-insensitive comparison
      chapterSections.sort((a, b) => 
        a.sortTitle.toLowerCase().localeCompare(b.sortTitle.toLowerCase())
      );

      setSections(chapterSections);
      setLastBookmarkVersion(bookmarkVersion);
      setHasCompletedInitialLoad(true);
      
      // Determine if there are bookmarks in the database
      setHasBookmarksInDatabase(chapterSections.length > 0);
    } catch (error) {
      console.error('❌ [BookmarkScreen] Error fetching bookmarked terms:', error);
      setSections([]);
      setHasCompletedInitialLoad(true);
      setHasBookmarksInDatabase(false);
    } finally {
      setLoadingState('idle');
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (chapters.length > 0) {
      setLoadingState('initial');
      fetchBookmarkedTerms();
    } else if (chapters.length === 0 && !loading) {
      // No chapters means no bookmarks - show empty state immediately
      setSections([]);
      setHasBookmarksInDatabase(false);
      setHasCompletedInitialLoad(true);
      setLoadingState('idle');
    }
  }, [chapters, loading]);

  useEffect(() => {
    if (bookmarkVersion !== lastBookmarkVersion && !isFetching) {
      // Only trigger full refresh for bookmark additions, not removals
      // Removals are handled locally by handleRemoveBookmark
      if (lastChangeType === 'add') {
        // Force refetch of chapters when bookmark is added
        // This ensures new chapters appear immediately when first bookmark is added
        const refetchAndUpdate = async () => {
          await refetch(); // Refetch chapters list first
          // fetchBookmarkedTerms will be called by the chapters useEffect
        };
        
        refetchAndUpdate();
      }
      setLastBookmarkVersion(bookmarkVersion);
    }
  }, [bookmarkVersion, lastBookmarkVersion, lastChangeType, refetch, isFetching]);

  // Reload data when screen comes into focus (e.g., when user clicks bookmarks tab)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );


  const handleRefresh = async () => {
    setLoadingState('refreshing');
    setSections([]); // Clear existing sections to show loading state
    try {
      await refetch();
      await fetchBookmarkedTerms(true);
    } finally {
      setLoadingState('idle');
    }
  };

  const sectionsKey = sections.map((s) => s.chapterId).join(',');
  // Unified loading state management
  const isInitialLoading = (loading || loadingState === 'initial' || loadingState === 'fetching') && (sections.length === 0 || hasBookmarksInDatabase === null);
  const isRefreshing = loadingState === 'refreshing';
  const showEmptyState = hasCompletedInitialLoad && loadingState === 'idle' && !loading && sections.length === 0 && (hasBookmarksInDatabase === false || (hasBookmarksInDatabase === null && chapters.length === 0));
  
  // Add effect to handle the transition from loading to idle when data is loaded
  useEffect(() => {
    if (!loading && loadingState === 'initial' && sections.length === 0 && hasCompletedInitialLoad) {
      // If we're done loading chapters but have no bookmarks, show empty state
      setLoadingState('idle');
    }
  }, [loading, loadingState, sections.length, hasCompletedInitialLoad]);

  return (
    <RequireAuth>
      <S.View className="flex-1 bg-blue-700 pt-12">
        <Header ClassName="z-90" title="Bookmarks" />
        {isInitialLoading ? (
          <S.View className="flex-1 bg-slate-100 items-center justify-center">
            <ActivityIndicator />
            <S.Text className="text-gray-700 text-lg mt-4 font-pmedium">Loading bookmarks...</S.Text>
          </S.View>
        ) : (
          <S.View className="flex-1 bg-slate-100">
            {/* Header with count and search */}
            {sections.length > 0 && !showEmptyState && (
              <S.View className="bg-slate-100 z-10 px-5 py-5">
                <S.View className="mb-4 px-3">
                  <S.Text className="uppercase text-gray-600 text-lg font-pbold tracking-wider">
                    Bookmarks <S.Text className="text-gray-400 text-base font-pregular">({totalFilteredCount})</S.Text>
                  </S.Text>
                </S.View>
                <S.View className="w-full px-3">
                  <AnimatedSearch 
                    value={searchQuery} 
                    onChangeText={setSearchQuery} 
                  />
                </S.View>
              </S.View>
            )}
            
            {showEmptyState ? (
              <S.ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: responsiveDimension(10),
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    colors={['#3b82f6']}
                    tintColor="#3b82f6"
                  />
                }
              >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ maxWidth: 400, width: '100%', padding: 20 }}>
                    <View style={{ alignItems: 'center', marginBottom: 24 }}>
                      <View style={styles.iconContainer}>
                        <S.Image 
                          source={BookmarkOutlineIcon} 
                          style={{ width: 48, height: 48, tintColor: '#3b82f6' }}
                        />
                      </View>
                      <S.Text style={styles.emptyTitle}>
                        No bookmarks yet
                      </S.Text>
                      <S.Text style={styles.emptySubtitle}>
                        Your bookmarked terms will appear here
                      </S.Text>
                    </View>

                    <View style={styles.instructionsContainer}>
                      <S.Text style={styles.instructionsTitle}>How to bookmark:</S.Text>
                      {[
                        { step: '1', text: 'Open a chapter from the home screen' },
                        {
                          step: '2',
                          text: 'Tap the bookmark icon next to a term to save it',
                          icon: true
                        },
                      ].map(({ step, text, icon }) => (
                        <View key={step} style={styles.stepContainer}>
                          <View style={styles.stepNumber}>
                            <S.Text style={styles.stepNumberText}>{step}</S.Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <S.Text style={styles.stepText}>
                              {icon ? (
                                <>
                                  Tap the <S.Image source={BookmarkOutlineIcon} style={{ width: 16, height: 16, tintColor: '#3b82f6', marginTop: 2 }} /> icon next to a term to save it
                                </>
                              ) : (
                                text
                              )}
                            </S.Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </S.ScrollView>
            ) : (
              <View style={{ flex: 1 }}>
                <FlashList
                  data={flatListData}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  getItemType={getItemType}
                  estimatedItemSize={88}
                  contentContainerStyle={{
                    paddingBottom: 20,
                    paddingTop: 10,
                    paddingHorizontal: 12,
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={handleRefresh}
                      colors={['#3b82f6']}
                      tintColor="#3b82f6"
                    />
                  }
                />
              </View>
            )}
          </S.View>
        )}
      </S.View>
    </RequireAuth>
  );
}
