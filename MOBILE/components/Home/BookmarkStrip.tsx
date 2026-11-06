import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from '@/styles';
import { BookmarkedTerm } from '@/services/api';
import { usePreferences } from '@/context/PreferencesProvider';

const CARD_SHADOW = { shadowColor: '#1d4ed8', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 };

interface Props {
  terms: (BookmarkedTerm & { ChapterTitle: string })[];
  onOpen: (term: BookmarkedTerm) => void;
  onBrowse: () => void;
}

// The student's bookmarks as small illustrated cards; a prompt to start bookmarking when there are none.
export const BookmarkStrip: React.FC<Props> = ({ terms, onOpen, onBrowse }) => {
  const { isDark } = usePreferences();
  if (terms.length === 0) {
    return (
      <S.TouchableOpacity
        onPress={onBrowse}
        activeOpacity={0.85}
        className="flex-row items-center rounded-2xl p-4 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800"
        style={CARD_SHADOW}
        accessibilityRole="button"
        accessibilityLabel="No bookmarks yet. Open a volume to bookmark important terms"
      >
        <S.View className="h-11 w-11 rounded-xl items-center justify-center bg-blue-700">
          <MaterialCommunityIcons name="bookmark-plus-outline" size={22} color="#ffffff" />
        </S.View>
        <S.View className="flex-1 ml-3">
          <S.Text className="text-base font-psemibold text-blue-950 dark:text-slate-100">No bookmarks yet</S.Text>
          <S.Text className="text-sm font-pregular text-slate-500 dark:text-slate-400">Bookmark the important, testable terms to find them here.</S.Text>
        </S.View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={isDark ? '#93c5fd' : '#1d4ed8'} />
      </S.TouchableOpacity>
    );
  }
  return (
    <S.ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -18 }} contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 12 }}>
      {terms.map((term) => (
        <S.TouchableOpacity
          key={term.TermId}
          onPress={() => onOpen(term)}
          activeOpacity={0.85}
          className="mr-3 w-[150px] rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800"
          style={CARD_SHADOW}
          accessibilityRole="button"
          accessibilityLabel={`${term.Term}, ${term.ChapterTitle}`}
        >
          <S.View className="h-[92px] bg-white items-center justify-center border-b border-slate-100 dark:border-slate-800">
            {term.Illustration ? (
              <S.Image source={{ uri: term.Illustration }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <MaterialCommunityIcons name="bookmark" size={30} color="#2563eb" />
            )}
          </S.View>
          <S.View className="px-2.5 pt-2 pb-2.5">
            <S.Text className="text-sm font-psemibold text-blue-950 dark:text-slate-100" numberOfLines={1}>{term.Term}</S.Text>
            <S.Text className="text-[11px] font-pregular text-slate-500 dark:text-slate-400" numberOfLines={1}>{term.ChapterTitle}</S.Text>
          </S.View>
        </S.TouchableOpacity>
      ))}
    </S.ScrollView>
  );
};
