import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as S from '@/styles';
import { RoutesChannel } from '@/constants';

interface Props {
  termId: number;
  chapterId: number;
  term: string;
  chapterTitle?: string;
  locked?: boolean;
  viewed?: boolean;
  badge?: string;          // e.g. "NEW"
  onOpen?: () => void;
}

// One term in search results or a root's term list. Locked volumes can't be opened.
export const TermResultRow: React.FC<Props> = ({ termId, chapterId, term, chapterTitle, locked, viewed, badge, onOpen }) => {
  const router = useRouter();

  const open = () => {
    if (locked) {
      Alert.alert('Volume locked', `“${term}” is in ${chapterTitle || 'a volume'} that isn’t unlocked yet.`);
      return;
    }
    onOpen?.();
    router.push({ pathname: RoutesChannel.TERM_LINE, params: { TermId: termId, ChapterId: chapterId, Term: term, Volume: chapterTitle ?? '' } });
  };

  return (
    <S.TouchableOpacity
      onPress={open}
      activeOpacity={0.8}
      className="flex-row items-center mx-4 mb-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
      accessibilityRole="button"
      accessibilityLabel={`${term}${badge ? `, ${badge.toLowerCase()}` : ''}${chapterTitle ? `, in ${chapterTitle}` : ''}${locked ? ', locked' : ''}${viewed ? ', viewed' : ''}`}
    >
      <S.View className="flex-1">
        <S.View className="flex-row items-center">
        {!!badge && (
          <S.View className="mr-2 px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900">
            <S.Text className="text-[10px] font-pbold text-green-800 dark:text-green-200">{badge}</S.Text>
          </S.View>
        )}
        <S.Text className={`flex-shrink text-base font-psemibold ${locked ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`} numberOfLines={1}>
          {term}
        </S.Text>
        </S.View>
        {!!chapterTitle && (
          <S.Text className="text-xs font-pregular text-slate-500 dark:text-slate-400" numberOfLines={1}>{chapterTitle}</S.Text>
        )}
      </S.View>
      {locked ? (
        <S.Text className="text-base ml-2" accessibilityElementsHidden>🔒</S.Text>
      ) : viewed ? (
        <S.Text className="text-xs font-pmedium text-green-700 dark:text-green-400 ml-2">✓ Viewed</S.Text>
      ) : (
        <S.Text className="text-lg text-slate-300 dark:text-slate-600 ml-2">›</S.Text>
      )}
    </S.TouchableOpacity>
  );
};
