import React, {
memo,
useCallback,
useEffect,
useMemo,
useRef,
useState
} from "react";
import {
RefreshControl,
Animated,
View
} from "react-native";
import { FlashList, FlashListProps, FlashListRef } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import {
AnimatedSearch,
ModalComponent,
SkeletonButton
} from "@/components";
import { useSearch } from "@/hooks";
import {
NoRecordsFound
} from "@/shared";
import { RoutesChannel } from "@/constants";
import { TermButton } from "@/components/FormInputs";
import { colors } from "@/styles/colors";
import * as S from "@/styles";
import { ListsContainerProps, SFC } from "@/types";
import { TermStatus } from "@/types/components/status";

type ListItem = {
  Id?: number;
  TermId?: number;
  Title?: string;
  Term?: string;
  ChapterId?: number;
  userTermsId?: number;
  UserTermsId?: number;
  status?: TermStatus;
  Status?: TermStatus;
};

export const ListsContainer: SFC<ListsContainerProps> = memo(({
  ClassName,
  Title = "NA",
  Data = [],
  RefreshStatus = false,
  FetchData,
  ShowScrollIndicator = false
}) => {
  const keyExtractor = useCallback((item: ListItem, index: number) => {
    const id = item?.Id?.toString() || item?.TermId?.toString();
    return id ? id : `item-${index}`;
  }, []);
  
  const router = useRouter();

  const { searchQuery, setSearchQuery, debouncedQuery, filteredData } = useSearch<ListItem>({
    data: Data,
    searchKeys: Title === 'Volumes' ? ['Title'] : ['Term'],
    delay: 150
  });

  const [activeModalId, setActiveModalId] = useState<number | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const flashListRef = useRef<FlashListRef<ListItem>>(null);
  const hadSearchQueryRef = useRef(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const indicatorHeight = useMemo(() => {
    if (contentHeight <= containerHeight) return 0;
    return Math.max(30, (containerHeight / contentHeight) * containerHeight * 0.9);
  }, [contentHeight, containerHeight]);

  const indicatorTranslateY = Animated.multiply(
    Animated.divide(scrollY, Math.max(1, contentHeight - containerHeight)),
    containerHeight - indicatorHeight
  );

  const toggleModal = (id: number | null) => setActiveModalId(id);

  const handleSearch = (text: string) => setSearchQuery(text);

  // Scroll to top when search is cleared (only if user had a search active)
  useEffect(() => {
    if (searchQuery.length > 0) {
      hadSearchQueryRef.current = true;
    } else if (searchQuery === '' && hadSearchQueryRef.current) {
      // Scroll to top only when clearing an active search
      hadSearchQueryRef.current = false;
      requestAnimationFrame(() => {
        flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
      });
    }
  }, [searchQuery]);

  const handlePress = (ChapterId: number, TermId: number) => {
    if (Title === 'Volumes') {
      router.push({ pathname: RoutesChannel.TERM, params: { ChapterId } });
    } else if (Title === 'Terms' || Title === 'Bookmarks') {
      router.push({ pathname: RoutesChannel.TERM_LINE, params: { ChapterId, TermId } });
    } else {
      router.push(RoutesChannel.HOME);
    }
  };

  const renderItem = useCallback<FlashListProps<ListItem>['renderItem']>(({ item }) => {
    if (!item) return <SkeletonButton />;

    const displayText = item?.Title || item?.Term || 'Untitled';
    const termId = item?.TermId;
    const chapterId = item?.ChapterId;
    const userTermsId = item?.userTermsId || item?.UserTermsId;
    const itemId = item?.Id;

    return (
      <S.View key={itemId} className="px-3">
        <TermButton
          data={{ TermId: termId, UserTermsId: userTermsId }}
          Text={displayText}
          HighlightQuery={debouncedQuery}
          OnRefresh={FetchData}
          Status={item.Status || item.status}
          OnPress={() => handlePress(chapterId || 0, termId || 0)}
          IsChapter={Title === 'Volumes'}
        />

        <ModalComponent
          isVisible={activeModalId === itemId}
          onClose={() => toggleModal(null)}
          title={displayText}
          content="This content is now available for free."
          leftButtonLabel="View Content"
          rightButtonLabel="Close"
          onLeftButtonPress={() => {
            toggleModal(null);
            handlePress(chapterId || 0, termId || 0);
          }}
          onRightButtonPress={() => toggleModal(null)}
        />
      </S.View>
    );
  }, [activeModalId, FetchData, Title, debouncedQuery]);

  const headerComponent = useMemo(() => (
    <S.View className="bg-slate-100 dark:bg-slate-950 z-10 px-4 py-5">
      <S.View className="mb-4">
        <S.Text className="uppercase text-gray-600 dark:text-slate-300 text-lg font-pbold tracking-wider">
          {Title} <S.Text className="text-gray-400 dark:text-slate-500 text-base font-pregular">({filteredData.length})</S.Text>
        </S.Text>
      </S.View>
      <S.View className="w-full">
        <AnimatedSearch
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </S.View>
    </S.View>
  ), [Title, filteredData.length, handleSearch, searchQuery]);

  return (
    <S.View className={`${ClassName} relative`}>
      {headerComponent}

      {ShowScrollIndicator && indicatorHeight > 0 && (
        <View
          className="absolute right-0 top-0 bottom-0 w-1.5 bg-black/10 rounded overflow-hidden"
          onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        >
          <Animated.View
            className="w-full bg-black/30 rounded"
            style={{
              height: indicatorHeight,
              transform: [{ translateY: indicatorTranslateY }]
            }}
          />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <FlashList<ListItem>
            ref={flashListRef}
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: 10,
          }}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl
              refreshing={RefreshStatus}
              onRefresh={FetchData}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={ShowScrollIndicator}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          onContentSizeChange={(_, height) => setContentHeight(height)}
          ListEmptyComponent={
            <NoRecordsFound
              title="No Records Found"
              message="No records found in the database"
            />
          }
          scrollEventThrottle={16}
          onLayout={({ nativeEvent }) =>
            setContainerHeight(nativeEvent.layout.height)
          }
        />
      </View>
    </S.View>
  );
}
);
