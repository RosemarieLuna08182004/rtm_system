import React, { useMemo, useCallback, useEffect } from 'react';
import { RefreshControl, View, useWindowDimensions } from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from "@/styles";
import { GenericFunction, SFC } from '@/types';
import { SubTermCard } from '@/components/Cards/SubTermCard';
import { useAuth, useGetTermWithSubTerms } from '@/hooks';
import { useRoute } from '@react-navigation/native';
import { StateView } from '@/components/States';
import ImageZoomViewer from '@/components/ImageZoomViewer';
import { usePreferences } from '@/context/PreferencesProvider';
import { useStudy } from '@/context/StudyProvider';
import { FadeInItem } from '@/components/Motion';

export interface TermLineListProps {
  Refetch : GenericFunction
}

// Original order: illustration, word in focus, then each category with its entries.
type ListItem =
  | { type: 'illustration'; illustration: string; id: string }
  | { type: 'focus'; focusWord: string; id: string }
  | { type: 'category'; category: string; id: string }
  | { type: 'subterm'; subterm: any; isLastOfCategory: boolean; id: string }
  | { type: 'spacer'; id: string };

const ILLUSTRATION_SHADOW = { shadowColor: '#1d4ed8', shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 10 };

// The illustration is the first and largest thing on the screen: blue frame, glow, tap to enlarge.
const IllustrationHero: React.FC<{ uri: string; termName: string }> = ({ uri, termName }) => {
  const { width } = useWindowDimensions();
  const { isDark } = usePreferences();
  const height = Math.min(420, Math.round((width - 24) * 0.85));
  return (
    <S.View className="px-3 mb-6">
      <ImageZoomViewer images={[{ uri }]} imageIndex={0}>
        <S.LinearGradient
          colors={['#1e3a8a', '#2563eb', '#38bdf8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 26, padding: 4, ...ILLUSTRATION_SHADOW }}
        >
          <S.View className="rounded-[22px] bg-white dark:bg-slate-900 overflow-hidden">
            <S.View className="flex-row items-center justify-between px-4 pt-3 pb-2">
              <S.View className="flex-row items-center rounded-full bg-blue-700 px-3 py-1">
                <MaterialCommunityIcons name="image-outline" size={14} color="#ffffff" />
                <S.Text className="ml-1.5 text-xs uppercase tracking-widest font-pbold text-white">Illustration</S.Text>
              </S.View>
              <S.View className="flex-row items-center">
                <MaterialCommunityIcons name="gesture-tap" size={16} color={isDark ? '#93c5fd' : '#1d4ed8'} />
                <S.Text className="ml-1 text-xs font-pmedium text-blue-700 dark:text-blue-300">Tap to enlarge</S.Text>
              </S.View>
            </S.View>
            <S.Image
              source={{ uri }}
              style={{ width: '100%', height }}
              resizeMode="contain"
              accessibilityLabel={`Illustration of ${termName}`}
            />
            <S.View className="absolute bottom-3 right-3 h-11 w-11 rounded-full items-center justify-center bg-blue-700" style={{ elevation: 4 }} accessibilityElementsHidden>
              <MaterialCommunityIcons name="magnify-plus-outline" size={22} color="#ffffff" />
            </S.View>
          </S.View>
        </S.LinearGradient>
      </ImageZoomViewer>
    </S.View>
  );
};

export const TermLineList: SFC<TermLineListProps> = ({ClassName, Refetch}) => {
  const route: any = useRoute()
  const {auth} = useAuth()
  const {isDark} = usePreferences()
  const {TermId, ChapterId} = route.params
  const UserId = auth?.user?.Id??0

  const {term, subterms, loading, error, refetch} = useGetTermWithSubTerms(TermId, UserId)

  const focusWord = useMemo(() => term?.Focus?.trim()??"", [term]);
  const illustration = useMemo(() => term?.Illustration??null, [term]);
  const termName = useMemo(() => String(term?.Term ?? '').trim(), [term]);

  // Remember this term for "Continue where you left off".
  const { recordView } = useStudy();
  useEffect(() => {
    if (termName) recordView({ TermId: Number(TermId), ChapterId: Number(ChapterId ?? term?.ChapterId ?? 0), Term: termName });
  }, [termName, TermId, ChapterId, recordView]);

  const flashListData = useMemo(() => {
    const result: ListItem[] = [];

    if (illustration) result.push({ type: 'illustration', illustration, id: 'illustration' });
    if (focusWord) result.push({ type: 'focus', focusWord, id: 'focus' });

    for (let index = 0; index < subterms.length; index++) {
      const subterm = subterms[index];
      // The illustration is already shown at the top.
      if (subterm.Category?.toUpperCase() === 'ILLUSTRATION') continue;

      const isFirstOfCategory = index === 0 || subterm.Category !== subterms[index - 1]?.Category;
      const isLastOfCategory = index === subterms.length - 1 || subterm.Category !== subterms[index + 1]?.Category;
      if (isFirstOfCategory) {
        result.push({ type: 'category', category: subterm.Category ?? 'NA', id: `category-${subterm.Category}-${index}` });
      }
      result.push({ type: 'subterm', subterm, isLastOfCategory, id: `subterm-${subterm.Id}-${index}` });
    }

    result.push({ type: 'spacer', id: 'spacer' });
    return result;
  }, [illustration, focusWord, subterms]);

  const renderCard = useCallback((item: ListItem) => {
    switch (item.type) {
      case 'illustration':
        return <IllustrationHero uri={item.illustration} termName={termName} />;

      case 'focus':
        return (
          <S.View className="px-3">
            <S.View className="mb-5 bg-blue-100 dark:bg-slate-800 rounded-lg p-3">
              <S.Text className="text-gray-500 dark:text-slate-400 text-md font-pregular">
                Word in Focus: <S.Text className="font-psemibold text-slate-800 dark:text-slate-100">{item.focusWord}</S.Text>
              </S.Text>
            </S.View>
          </S.View>
        );

      case 'category':
        return (
          <S.View className="px-3 w-full mb-2">
            <S.Text className="text-sm uppercase font-pbold text-blue-700 dark:text-blue-300" accessibilityRole="header">
              {item.category}
            </S.Text>
          </S.View>
        );

      case 'subterm':
        return (
          <S.View className="px-3">
            <SubTermCard
              Id={Number(item.subterm.Id)}
              Term={item.subterm.Term ?? ""}
              Description={item.subterm.Description ?? ""}
              IsBorderLeft={item.subterm.IsBorderLeft ?? false}
              ClassName={item.isLastOfCategory ? "mb-5" : ""}
            />
          </S.View>
        );

      case 'spacer':
        return <S.View className="h-[100px] w-full" />;

      default:
        return null;
    }
  }, [termName]);

  // Each block slides in a moment after the one above it.
  const renderItem: FlashListProps<ListItem>['renderItem'] = useCallback(({ item, index }) => (
    <FadeInItem index={index}>{renderCard(item)}</FadeInItem>
  ), [renderCard]);

  const keyExtractor = useCallback((item: ListItem) => item.id, []);
  const getItemType = useCallback((item: ListItem) => item.type, []);

  const fetchData = useCallback(() => {
    Refetch()
    refetch();
  }, [Refetch, refetch])

  // Full-screen states only when there's nothing to show; a pull-to-refresh keeps the term visible.
  if (loading && subterms.length === 0) return <StateView Kind="loading" Title="Loading term…" />;
  if (error && subterms.length === 0) return <StateView Kind="error" Title="Could not load this term" Message={error} OnRetry={() => refetch()} />;
  if (subterms.length === 0) return <StateView Kind="empty" Icon="book-open-blank-variant" Title="No details yet" Message="This term doesn’t have its details added yet. Check back later." />;
  return (
    <View className={`w-full ${ClassName ?? ''}`} style={{ flex: 1 }}>
      <FlashList<ListItem>
        data={flashListData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        extraData={isDark}
        drawDistance={250}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20, paddingHorizontal: 4 }}
        refreshControl={<RefreshControl refreshing={loading && subterms.length > 0} onRefresh={fetchData} />}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};
