import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { StyleSheet, RefreshControl, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter, useFocusEffect } from 'expo-router';
import { BookmarkOutlineIcon } from '@/constants';
import { AnimatedSearch } from '@/components/Filters/SearchFilter';
import * as S from '@/styles';
import { ActivityIndicator, FadeInItem, Header, StateView } from '@/components';
import { RequireAuth, useBookmarkContext, useThemeColors } from '@/context';
import { useAuth, useGetMyBookmarks } from '@/hooks';
import { TermTable } from '@/types/tables';
import { RoutesChannel } from '@/constants';
import { BookmarkTermButton } from '@/components/FormInputs';
import { TermStatus } from '@/types/components/status';
import { responsiveDimension } from '@/utils';

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

interface TermWithChapter extends Omit<TermTable, 'Status' | 'TermId' | 'UserTermsId'> {
  chapterTitle: string;
  Status: TermStatus | string;
  TermId: number;
  UserTermsId: number;
  ChapterId: number;
}

type ListItem =
  | { type: 'header'; title: string; id: string; count: number }
  | { type: 'item'; item: TermWithChapter; id: string };

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
  const UserId = auth?.user?.Id ?? 0;
  // One request for every bookmark, grouped by chapter (was one request per chapter).
  const { groups, loading, error, refreshing, refetch } = useGetMyBookmarks(UserId);
  const { bookmarkVersion } = useBookmarkContext();
  const theme = useThemeColors();
  const [sections, setSections] = useState<ChapterSection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Server data -> list sections (already sorted by the server).
  useEffect(() => {
    setSections(groups.map((group) => ({
      title: group.Title || `Chapter ${group.ChapterId}`,
      chapterId: group.ChapterId,
      data: group.terms.map((term) => ({
        ...term,
        chapterTitle: group.Title,
      })) as unknown as TermWithChapter[],
    })));
  }, [groups]);

  // Reload on focus only when a bookmark changed somewhere since the last load.
  const loadedVersionRef = useRef(bookmarkVersion);
  useFocusEffect(
    useCallback(() => {
      if (loadedVersionRef.current !== bookmarkVersion) {
        loadedVersionRef.current = bookmarkVersion;
        refetch(true);
      }
    }, [bookmarkVersion, refetch])
  );

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase().trim();
    return sections
      .map(section => ({
        ...section,
        data: section.data.filter(term =>
          (term.Term ?? '').toLowerCase().includes(query)
        )
      }))
      .filter(section => section.data.length > 0);
  }, [sections, searchQuery]);

  const totalFilteredCount = useMemo(
    () => filteredSections.reduce((sum, s) => sum + s.data.length, 0),
    [filteredSections]
  );

  const flatListData = useMemo(() => {
    const result: ListItem[] = [];
    for (const section of filteredSections) {
      result.push({
        type: 'header',
        title: section.title,
        id: `header-${section.chapterId}`,
        count: section.data.length
      });
      for (const item of section.data) {
        result.push({ type: 'item', item, id: `item-${item.TermId}-${item.ChapterId}` });
      }
    }
    return result;
  }, [filteredSections]);

  // Unbookmarked on this screen: remove the row immediately.
  const handleRemoveBookmark = useCallback((termId: number, chapterId: number) => {
    setSections(prevSections => prevSections
      .map(section => section.chapterId === chapterId
        ? { ...section, data: section.data.filter(term => term.TermId !== termId) }
        : section)
      .filter(section => section.data.length > 0));
  }, []);

  const renderItem = useCallback(({ item, index }: { item: ListItem; index: number }) => {
    if (item.type === 'header') {
      return (
        <S.View className="px-4 py-3" style={styles.sectionHeader}>
          <S.Text style={[styles.sectionHeaderText, { color: theme.mutedText }]}>{item.title}</S.Text>
        </S.View>
      );
    }

    const { item: term } = item;
    return (
      <FadeInItem index={index} style={{ paddingHorizontal: 16 }}>
        <MemoizedBookmarkTermButton
          Text={term.Term}
          OnPress={() => {
            router.push({
              pathname: RoutesChannel.TERM_LINE,
              params: {
                ChapterId: term.ChapterId,
                TermId: term.TermId,
                Term: term.Term,
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
      </FadeInItem>
    );
  }, [router, handleRemoveBookmark]);

  const keyExtractor = useCallback((item: ListItem) => item.id, []);
  const getItemType = useCallback((item: ListItem) => item.type, []);

  const handleRefresh = useCallback(() => {
    loadedVersionRef.current = bookmarkVersion;
    refetch(true);
  }, [bookmarkVersion, refetch]);

  const isInitialLoading = loading && sections.length === 0;
  const isRefreshing = refreshing;
  const showErrorState = !loading && !!error && sections.length === 0;
  const showEmptyState = !loading && !error && sections.length === 0;

  return (
    <RequireAuth>
      <S.View className="flex-1 bg-blue-700 pt-12">
        <Header ClassName="z-90" title="Bookmarks" />
        {showErrorState ? (
          <StateView Kind="error" Title="Could not load bookmarks" Message={error ?? undefined} OnRetry={handleRefresh} />
        ) : isInitialLoading ? (
          <S.View className="flex-1 bg-slate-100 dark:bg-slate-950 items-center justify-center">
            <ActivityIndicator />
            <S.Text className="text-gray-700 dark:text-slate-200 text-lg mt-4 font-pmedium">Loading bookmarks...</S.Text>
          </S.View>
        ) : (
          <S.View className="flex-1 bg-slate-100 dark:bg-slate-950">
            {/* Header with count and search */}
            {sections.length > 0 && !showEmptyState && (
              <S.View className="bg-slate-100 dark:bg-slate-950 z-10 px-5 py-5">
                <S.View className="mb-4 px-3">
                  <S.Text className="uppercase text-gray-600 dark:text-slate-300 text-lg font-pbold tracking-wider">
                    Bookmarks <S.Text className="text-gray-400 dark:text-slate-500 text-base font-pregular">({totalFilteredCount})</S.Text>
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
                      <View style={[styles.iconContainer, { backgroundColor: theme.card }]}>
                        <S.Image 
                          source={BookmarkOutlineIcon} 
                          style={{ width: 48, height: 48, tintColor: '#3b82f6' }}
                        />
                      </View>
                      <S.Text style={[styles.emptyTitle, { color: theme.text }]}>
                        No bookmarks yet
                      </S.Text>
                      <S.Text style={[styles.emptySubtitle, { color: theme.mutedText }]}>
                        Your bookmarked terms will appear here
                      </S.Text>
                    </View>

                    <View style={[styles.instructionsContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <S.Text style={[styles.instructionsTitle, { color: theme.text }]}>How to bookmark:</S.Text>
                      {[
                        { step: '1', text: 'Open a volume from the Volumes tab' },
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
                            <S.Text style={[styles.stepText, { color: theme.mutedText }]}>
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

                    <S.TouchableOpacity
                      onPress={() => router.push(RoutesChannel.VOLUMES)}
                      className="mt-6 self-center flex-row items-center rounded-full px-6 py-3 bg-blue-700 dark:bg-blue-600"
                      accessibilityRole="button"
                      accessibilityLabel="Browse volumes"
                    >
                      <S.Text className="text-white font-psemibold">Browse volumes</S.Text>
                    </S.TouchableOpacity>
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
