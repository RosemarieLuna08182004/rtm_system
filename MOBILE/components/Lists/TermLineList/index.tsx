import React, { useMemo, useCallback } from 'react';
import { RefreshControl, View } from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import * as S from "@/styles";
import { GenericFunction, SFC } from '@/types';
import { SubTermCard } from '@/components/Cards/SubTermCard';
import { ActivityIndicator } from '@/components/Containers/ActivityIndicator';
import { useAuth, useGetTermWithSubTerms } from '@/hooks';
import { useRoute } from '@react-navigation/native';
import { NoRecordsFound } from '@/shared/message/noRecord';
import { BookOutlineIcon } from '@/constants';
import ImageZoomViewer from '@/components/ImageZoomViewer';

export interface TermLineListProps {
  Refetch : GenericFunction
}

type ListItem = 
  | { type: 'illustration'; illustration: string; id: string }
  | { type: 'focus'; focusWord: string; id: string }
  | { type: 'category'; category: string; id: string }
  | { type: 'subterm'; subterm: any; isLastOfCategory: boolean; id: string }
  | { type: 'spacer'; id: string };

export const TermLineList: SFC<TermLineListProps> = ({ClassName, Refetch}) => {
  const route: any = useRoute()
  const {auth} = useAuth()
  const {TermId} = route.params
  const UserId = auth?.user?.Id??0

  const {term, subterms, loading, refetch} = useGetTermWithSubTerms(TermId, UserId)
  
  const focusWord = useMemo(() => term?.Focus?.trim()??"", [term]);
  const illustration = useMemo(() => term?.Illustration??null, [term]);
  const refreshStatus = loading;
  
  const images = illustration ? [{ uri: illustration }] : [];

  // Prepare data for FlashList
  const flashListData = useMemo(() => {
    const result: ListItem[] = [];
    
    // Add illustration if exists
    if (illustration) {
      result.push({
        type: 'illustration',
        illustration,
        id: 'illustration'
      });
    }    
    // Add focus word if exists
    if (focusWord) {
      result.push({
        type: 'focus',
        focusWord,
        id: 'focus'
      });
    }
    
    // Add subterms with categories
    for (let index = 0; index < subterms.length; index++) {
      const subterm = subterms[index];
      
      // Skip subterms that belong to the "ILLUSTRATION" category
      // since it's already rendered at the top of the list
      if (subterm.Category?.toUpperCase() === 'ILLUSTRATION') {
        continue;
      }

      const isFirstOfCategory = index === 0 || subterm.Category !== subterms[index - 1]?.Category;
      const isLastOfCategory = index === subterms.length - 1 || subterm.Category !== subterms[index + 1]?.Category;
      
      // Add category header if first of category
      if (isFirstOfCategory) {
        result.push({
          type: 'category',
          category: subterm.Category ?? "NA",
          id: `category-${subterm.Category}-${index}`
        });
      }
      
      // Add subterm
      result.push({
        type: 'subterm',
        subterm,
        isLastOfCategory,
        id: `subterm-${subterm.Id}-${index}`
      });
    }
    
    // Add spacer at the end
    result.push({
      type: 'spacer',
      id: 'spacer'
    });
    
    return result;
  }, [illustration, focusWord, subterms]);
  
  // Render item function
  const renderItem: FlashListProps<ListItem>['renderItem'] = useCallback(({ item }) => {
    switch (item.type) {
      case 'illustration':
        return (
          <S.View className="px-3">
            <S.View className="w-full mb-2">
              <S.View className="w-full flex justify-start items-start">
                <S.Text className="text-sm uppercase text-primary font-pbold text-blue-700">
                  ILLUSTRATION
                </S.Text>
              </S.View>
            </S.View>
            <ImageZoomViewer
              images={images}
              imageIndex={0}
            >
              <S.View className="mb-5 bg-blue-100 rounded-lg p-4">
                <S.Image 
                  source={{ uri: item.illustration }} 
                  className="w-full h-48 rounded-md"
                  resizeMode="contain"
                />
              </S.View>
            </ImageZoomViewer>
          </S.View>
        );
        
      case 'focus':
        return (
          <S.View className="px-3">
            <S.View className="mb-5 bg-blue-100 rounded-lg p-3">
              <S.Text className="text-gray-500 text-md" style={{ fontFamily: 'Poppins_400Regular' }}>
                Word in Focus: <S.Text className="font-psemibold text-slate-800">{item.focusWord}</S.Text>
              </S.Text>
            </S.View>
          </S.View>
        );
        
      case 'category':
        return (
          <S.View className="px-3">
            <S.View className="w-full mb-2">
              <S.View className="w-full flex justify-start items-start">
                <S.Text className="text-sm uppercase text-primary font-pbold text-blue-700">
                  {item.category}
                </S.Text>
              </S.View>
            </S.View>
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
  }, [images]);
  
  // Key extractor
  const keyExtractor = useCallback((item: ListItem) => item.id, []);
  
  // Get item type for FlashList optimization
  const getItemType = useCallback((item: ListItem) => item.type, []);

  const fetchData = useCallback(() => {
    Refetch()
    refetch();
  }, [Refetch, refetch])

  if (refreshStatus) return <ActivityIndicator ClassName='w-screen' />;
  if (subterms.length === 0) return <NoRecordsFound title='No Sub Terms found' icon={BookOutlineIcon} ClassName="w-screen h-[85vh]" />  
    return (
      <View className={`w-full ${ClassName}`} style={{ flex: 1 }}>
        <FlashList<ListItem>
          data={flashListData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          drawDistance={250}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 20
          }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshStatus} 
              onRefresh={fetchData}
            />
          }
          showsVerticalScrollIndicator={true}
          removeClippedSubviews={true}
        />
      </View>
    );
};

