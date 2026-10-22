import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from '@/styles';
import { RoutesChannel } from '@/constants';
import { usePreferences } from '@/context/PreferencesProvider';
import { WordBreakdown, WordPart } from '@/utils/morphology';
import { isSpeechAvailable, speakText, stopSpeaking } from '@/utils/speech';

interface Props {
  term: string;
  breakdown: WordBreakdown;
}

export const CARD_SHADOW = { shadowColor: '#1e3a8a', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 };

// "Word parts" card: the term split into chips, a pronunciation button and the literal meaning.
export const WordPartsCard: React.FC<Props> = ({ term, breakdown }) => {
  const router = useRouter();
  const { isDark } = usePreferences();
  const [speaking, setSpeaking] = useState(false);
  const canSpeak = isSpeechAvailable();

  // Stop talking when leaving the term.
  useEffect(() => () => { stopSpeaking(); }, []);

  if (breakdown.parts.length === 0 && !breakdown.literal && !canSpeak) return null;

  const toggleSpeech = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speakText(term, () => setSpeaking(false));
  };

  const openRoot = (part: WordPart) => {
    if (!part.rootWord) return;
    router.push({ pathname: RoutesChannel.ROOT, params: { root: part.rootWord, meaning: part.meaning ?? '', from: term } });
  };

  return (
    <S.View className="mb-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4" style={CARD_SHADOW}>
      <S.View className="flex-row items-center">
        <S.Text className="flex-1 text-sm uppercase tracking-wider font-pbold text-blue-700 dark:text-blue-300" accessibilityRole="header">
          Word parts
        </S.Text>
        {canSpeak && (
          <S.TouchableOpacity
            onPress={toggleSpeech}
            className={`h-11 w-11 rounded-full items-center justify-center ${speaking ? 'bg-blue-700' : 'bg-blue-50 dark:bg-slate-800'}`}
            accessibilityRole="button"
            accessibilityLabel={speaking ? 'Stop pronunciation' : `Pronounce ${term}`}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name={speaking ? 'stop' : 'volume-high'} size={22} color={speaking ? '#ffffff' : isDark ? '#93c5fd' : '#1d4ed8'} />
          </S.TouchableOpacity>
        )}
      </S.View>

      {breakdown.parts.length > 0 && (
        <S.View className="flex-row flex-wrap items-center mt-3">
          {breakdown.parts.map((part, index) => {
            const isSuffix = part.type === 'suffix';
            const tappable = !!part.rootWord;
            return (
              <S.View key={`${part.text}-${index}`} className="flex-row items-center mb-2">
                {index > 0 && <S.Text className="mx-2 text-lg font-pmedium text-slate-400 dark:text-slate-500">+</S.Text>}
                <S.TouchableOpacity
                  disabled={!tappable && !canSpeak}
                  onPress={tappable ? () => openRoot(part) : undefined}
                  onLongPress={canSpeak ? () => speakText(part.text.replace(/^-|-$/g, '')) : undefined}
                  className="flex-row items-center rounded-xl px-3 py-2 bg-blue-50 border border-blue-100 dark:bg-slate-800 dark:border-slate-700"
                  accessibilityRole={tappable ? 'button' : 'text'}
                  accessibilityLabel={`${part.text}${part.meaning ? `, meaning ${part.meaning}` : ''}${part.origin ? `, from ${part.origin}` : ''}`}
                  accessibilityHint={tappable ? 'Shows other terms that use this root' : undefined}
                >
                  <S.Text className={`text-base font-pbold ${isSuffix ? 'text-blue-600 dark:text-blue-300' : 'text-blue-950 dark:text-slate-100'}`}>
                    {part.text}
                  </S.Text>
                  {!!part.meaning && (
                    <S.Text className="ml-1 text-sm font-pregular text-slate-500 dark:text-slate-400 max-w-[170px]" numberOfLines={2}>
                      ({part.meaning})
                    </S.Text>
                  )}
                </S.TouchableOpacity>
              </S.View>
            );
          })}
        </S.View>
      )}

      {breakdown.parts.some((p) => p.rootWord) && (
        <S.Text className="mt-1 text-xs font-pregular text-slate-400 dark:text-slate-500">
          Tap a root to see other terms that use it{canSpeak ? '  •  hold a part to hear it' : ''}
        </S.Text>
      )}

      {!!breakdown.literal && (
        <S.View className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
          <S.Text className="text-sm font-pregular text-slate-600 dark:text-slate-300">
            <S.Text className="font-psemibold text-slate-700 dark:text-slate-200">Literally: </S.Text>
            “{breakdown.literal}”
          </S.Text>
        </S.View>
      )}
    </S.View>
  );
};
