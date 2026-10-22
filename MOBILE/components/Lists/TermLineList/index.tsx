import React, { useMemo, useCallback, useEffect } from 'react';
import { RefreshControl, View } from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from "@/styles";
import { GenericFunction, SFC } from '@/types';
import { HTMLContent } from '@/components/Cards/SubTermCard';
import { useAuth, useGetTermWithSubTerms } from '@/hooks';
import { useRoute } from '@react-navigation/native';
import { StateView } from '@/components/States';
import { RoutesChannel } from '@/constants';
import ImageZoomViewer from '@/components/ImageZoomViewer';
import { CARD_SHADOW, WordPartsCard } from '@/components/Term/WordPartsCard';
import { TermNoteCard } from '@/components/Term/TermNoteCard';
import { usePreferences } from '@/context/PreferencesProvider';
import { useStudy } from '@/context/StudyProvider';
import { parseWordBreakdown } from '@/utils/morphology';
import { IconName } from '@/utils/subjectStyle';
import { FadeInItem } from '@/components/Motion';

export interface TermLineListProps {
  Refetch : GenericFunction
}

type ListItem =
  | { type: 'overview'; id: string }
  | { type: 'note'; id: string }
  | { type: 'illustration'; illustration: string; id: string }
  | { type: 'focus'; focusWord: string; id: string }
  | { type: 'section'; category: string; subterms: any[]; id: string }
  | { type: 'spacer'; id: string };

// Icon for each section, matched by its category name.
const sectionIcon = (category: string): IconName => {
  const c = category.toLowerCase();
  if (c.includes('focus')) return 'bullseye-arrow';
  if (c.includes('relevant') || c.includes('related')) return 'book-open-variant';
  if (c.includes('definition')) return 'clipboard-text-outline';
  if (c.includes('morpholog')) return 'molecule';
  if (c.includes('root')) return 'sitemap';
  return 'text-box-outline';
};

interface SectionCardProps {
  icon: IconName;
  title: string;
  onOpen?: () => void;
  openLabel?: string;
  children: React.ReactNode;
}

// White card with an icon, a blue title, and its content in a light-blue panel.
const SectionCard: React.FC<SectionCardProps> = ({ icon, title, onOpen, openLabel, children }) => {
  const { isDark } = usePreferences();
  const accent = isDark ? '#93c5fd' : '#1d4ed8';
  return (
    <S.View className="mb-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4" style={CARD_SHADOW}>
      <S.TouchableOpacity
        disabled={!onOpen}
        onPress={onOpen}
        activeOpacity={0.7}
        className="flex-row items-center mb-3"
        accessibilityRole={onOpen ? 'button' : 'header'}
        accessibilityLabel={onOpen ? openLabel : title}
      >
        <S.View className="h-11 w-11 rounded-xl items-center justify-center bg-blue-50 dark:bg-slate-800">
          <MaterialCommunityIcons name={icon} size={22} color={accent} />
        </S.View>
        <S.Text className="flex-1 ml-3 text-sm uppercase tracking-wider font-pbold text-blue-700 dark:text-blue-300">{title}</S.Text>
        {!!onOpen && <MaterialCommunityIcons name="chevron-right" size={24} color={accent} />}
      </S.TouchableOpacity>
      {children}
    </S.View>
  );
};

const Panel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <S.View className={`rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 px-4 py-3 ${className ?? ''}`}>
    {children}
  </S.View>
);

export const TermLineList: SFC<TermLineListProps> = ({ClassName, Refetch}) => {
  const route: any = useRoute()
  const router = useRouter()
  const {auth} = useAuth()
  const {isDark} = usePreferences()
  const {TermId, ChapterId} = route.params
  const UserId = auth?.user?.Id??0

  const {term, subterms, loading, error, refetch} = useGetTermWithSubTerms(TermId, UserId)

  const focusWord = useMemo(() => term?.Focus?.trim()??"", [term]);
  const illustration = useMemo(() => term?.Illustration??null, [term]);
  const refreshStatus = loading;

  const images = illustration ? [{ uri: illustration }] : [];
  const termName = useMemo(() => String(term?.Term ?? '').trim(), [term]);
  // Word parts from the term's Root and Term Morphology entries.
  const breakdown = useMemo(() => parseWordBreakdown(subterms as any[]), [subterms]);
  const firstRoot = useMemo(() => breakdown.parts.find((p) => p.rootWord), [breakdown]);

  // Remember this term for progress and "Continue where you left off".
  const { recordView } = useStudy();
  useEffect(() => {
    if (termName) recordView({ TermId: Number(TermId), ChapterId: Number(ChapterId ?? term?.ChapterId ?? 0), Term: termName });
  }, [termName, TermId, ChapterId, recordView]);

  // Word parts, note, illustration, word in focus, then one card per category.
  const flashListData = useMemo(() => {
    const result: ListItem[] = [];

    if (termName) {
      result.push({ type: 'overview', id: 'overview' });
      result.push({ type: 'note', id: 'note' });
    }
    if (illustration) result.push({ type: 'illustration', illustration, id: 'illustration' });
    if (focusWord) result.push({ type: 'focus', focusWord, id: 'focus' });

    // Group consecutive subterms of the same category into one section.
    for (let index = 0; index < subterms.length; index++) {
      const subterm = subterms[index];
      // The illustration is already shown above.
      if (subterm.Category?.toUpperCase() === 'ILLUSTRATION') continue;
      const category = String(subterm.Category ?? '').trim() || 'Details';
      const last = result[result.length - 1];
      if (last?.type === 'section' && last.category === category) {
        last.subterms.push(subterm);
      } else {
        result.push({ type: 'section', category, subterms: [subterm], id: `section-${category}-${index}` });
      }
    }

    result.push({ type: 'spacer', id: 'spacer' });
    return result;
  }, [illustration, focusWord, subterms, termName]);

  const searchFor = useCallback((word: string) => {
    router.push({ pathname: RoutesChannel.SEARCH, params: { q: word } });
  }, [router]);

  const renderCard = useCallback((item: ListItem) => {
    switch (item.type) {
      case 'overview':
        return <WordPartsCard term={termName} breakdown={breakdown} />;

      case 'note':
        return <TermNoteCard termId={Number(TermId)} />;

      case 'illustration':
        return (
          <S.View className="mb-4">
            <S.Text className="mb-2 ml-1 text-sm uppercase tracking-wider font-pbold text-blue-700 dark:text-blue-300">Illustration</S.Text>
            <ImageZoomViewer images={images} imageIndex={0}>
              <S.View className="rounded-2xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 p-3">
                <S.Image source={{ uri: item.illustration }} className="w-full h-52 rounded-xl" resizeMode="contain" accessibilityLabel={`Illustration of ${termName}`} />
                <S.View className="absolute bottom-4 right-4 h-9 w-9 rounded-full items-center justify-center bg-white/90 dark:bg-slate-900/90" accessibilityElementsHidden>
                  <MaterialCommunityIcons name="magnify-plus-outline" size={20} color={isDark ? '#93c5fd' : '#1d4ed8'} />
                </S.View>
              </S.View>
            </ImageZoomViewer>
          </S.View>
        );

      case 'focus':
        return (
          <SectionCard
            icon="bullseye-arrow"
            title="Word in focus"
            onOpen={() => searchFor(item.focusWord)}
            openLabel={`Word in focus: ${item.focusWord}. Search for terms like it`}
          >
            <Panel>
              <S.Text className="text-base font-psemibold text-blue-950 dark:text-slate-100">{item.focusWord}</S.Text>
            </Panel>
          </SectionCard>
        );

      case 'section': {
        const isRoot = /root/i.test(item.category) && !/morpholog/i.test(item.category);
        const isDefinition = /definition/i.test(item.category);
        const openRoot = isRoot && firstRoot?.rootWord
          ? () => router.push({ pathname: RoutesChannel.ROOT, params: { root: firstRoot.rootWord!, meaning: firstRoot.meaning ?? '', from: termName } })
          : undefined;
        return (
          <SectionCard
            icon={sectionIcon(item.category)}
            title={item.category}
            onOpen={openRoot}
            openLabel={`${item.category}. See other terms that use ${firstRoot?.rootWord ?? 'this root'}`}
          >
            {item.subterms.map((subterm: any, index: number) => (
              <Panel key={`${subterm.Id}-${index}`} className={index > 0 ? 'mt-2' : ''}>
                {isDefinition ? (
                  <S.View className="flex-row">
                    <MaterialCommunityIcons name="format-quote-open" size={22} color={isDark ? '#60a5fa' : '#3b82f6'} style={{ marginRight: 6, marginTop: -2 }} />
                    <S.View className="flex-1">
                      <HTMLContent html={subterm.Description ?? ''} />
                    </S.View>
                  </S.View>
                ) : (
                  <HTMLContent html={subterm.Description ?? ''} />
                )}
              </Panel>
            ))}
          </SectionCard>
        );
      }

      case 'spacer':
        return <S.View className="h-[100px] w-full" />;

      default:
        return null;
    }
  }, [images, termName, breakdown, TermId, isDark, firstRoot, router, searchFor]);

  // Each card slides in a moment after the one above it.
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
  if (subterms.length === 0) return <StateView Kind="empty" Icon="book-open-blank-variant" Title="No details yet" Message="This term doesn’t have its word parts or definition added yet. Check back later." />;
  return (
    <View className={`w-full ${ClassName ?? ''}`} style={{ flex: 1 }}>
      <FlashList<ListItem>
        data={flashListData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        extraData={isDark}
        drawDistance={250}
        contentContainerStyle={{ paddingTop: 18, paddingBottom: 20, paddingHorizontal: 16 }}
        refreshControl={<RefreshControl refreshing={refreshStatus && subterms.length > 0} onRefresh={fetchData} />}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};
