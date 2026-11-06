import React, { useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, { Extrapolation, FadeInDown, interpolate, ReduceMotion, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from '@/styles';
import ImageZoomViewer from '@/components/ImageZoomViewer';
import { IllustratedTerm } from '@/services/api';

const GAP = 14;
// Coloured blur, drawn on Android too (shadowColor/elevation only give a grey edge there).
const GLOW = '0px 14px 30px rgba(29, 78, 216, 0.45)';
const SIDE_GLOW = '0px 8px 18px rgba(29, 78, 216, 0.25)';

interface Props {
  items: IllustratedTerm[];
  onOpen: (item: IllustratedTerm) => void;
}

// One illustration card: the picture fills the frame, with the name on a dark fade at the bottom.
// The middle card is full size and in front; its neighbours shrink, fade and tuck in behind it.
const Card: React.FC<{ item: IllustratedTerm; index: number; width: number; height: number; scrollX: SharedValue<number>; onOpen: Props['onOpen']; onBroken: (id: number) => void }> = ({ item, index, width, height, scrollX, onOpen, onBroken }) => {
  const step = width + GAP;
  const tuck = width * 0.1;
  const animated = useAnimatedStyle(() => {
    const input = [(index - 1) * step, index * step, (index + 1) * step];
    const focus = interpolate(scrollX.value, input, [0, 1, 0], Extrapolation.CLAMP);
    // A card waiting on the right is pulled left (and one on the left pulled right) so it peeks out from behind.
    const translateX = interpolate(scrollX.value, input, [-tuck, 0, tuck], Extrapolation.CLAMP);
    const scale = 0.88 + focus * 0.12;
    return {
      zIndex: Math.round(focus * 10),
      opacity: 0.6 + focus * 0.4,
      transform: [{ translateX }, { scale }] as const,
      boxShadow: focus > 0.5 ? GLOW : SIDE_GLOW,
    };
  });

  return (
    <Animated.View style={[{ width, height, marginRight: GAP, borderRadius: 28 }, animated]}>
      <S.LinearGradient colors={['#1e3a8a', '#2563eb', '#38bdf8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, borderRadius: 28, padding: 4 }}>
        <S.View className="flex-1 rounded-[24px] bg-white overflow-hidden">
          <ImageZoomViewer images={[{ uri: item.Illustration }]} imageIndex={0}>
            <S.Image
              source={{ uri: item.Illustration }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              onError={() => onBroken(item.TermId)}
              accessibilityLabel={`Illustration of ${item.Term}. Tap to enlarge`}
            />
          </ImageZoomViewer>

          <S.View className="absolute top-3.5 right-3.5 h-11 w-11 rounded-full items-center justify-center bg-white/95" style={{ boxShadow: '0px 4px 10px rgba(15, 23, 42, 0.18)' }} pointerEvents="none" accessibilityElementsHidden>
            <MaterialCommunityIcons name="magnify-plus-outline" size={22} color="#1d4ed8" />
          </S.View>

          {/* Dark fade so the white text reads on any picture. */}
          <S.LinearGradient
            colors={['rgba(15,23,42,0)', 'rgba(15,23,42,0.6)', 'rgba(15,23,42,0.93)']}
            locations={[0, 0.45, 1]}
            pointerEvents="box-none"
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '52%', justifyContent: 'flex-end', paddingHorizontal: 18, paddingBottom: 18 }}
          >
            <S.View className="self-start rounded-full bg-white/20 border border-white/30 px-3 py-1" pointerEvents="none">
              <S.Text className="text-white text-[10px] uppercase tracking-widest font-pbold" numberOfLines={1}>{item.ChapterTitle}</S.Text>
            </S.View>
            <S.Text className="text-white text-2xl font-pbold mt-2" numberOfLines={2} pointerEvents="none">{item.Term}</S.Text>
            <S.View className="flex-row items-center justify-between mt-3">
              <S.Text className="text-slate-300 text-xs font-pregular">Swipe for more</S.Text>
              <S.TouchableOpacity
                onPress={() => onOpen(item)}
                className="flex-row items-center bg-white rounded-full px-4 py-2"
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.Term}`}
              >
                <S.Text className="text-blue-700 text-sm font-pbold mr-1">Open term</S.Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color="#1d4ed8" />
              </S.TouchableOpacity>
            </S.View>
          </S.LinearGradient>
        </S.View>
      </S.LinearGradient>
    </Animated.View>
  );
};

const Dot: React.FC<{ index: number; step: number; scrollX: SharedValue<number> }> = ({ index, step, scrollX }) => {
  const animated = useAnimatedStyle(() => {
    const input = [(index - 1) * step, index * step, (index + 1) * step];
    return {
      width: interpolate(scrollX.value, input, [7, 24, 7], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, input, [0.35, 1, 0.35], Extrapolation.CLAMP),
    };
  });
  return <Animated.View style={[{ height: 7, borderRadius: 4, marginHorizontal: 3, backgroundColor: '#2563eb' }, animated]} />;
};

// Swipeable illustrations for Home. Cards whose picture fails to load are left out.
export const IllustrationCarousel: React.FC<Props> = ({ items, onOpen }) => {
  const { width: screen } = useWindowDimensions();
  // Narrow enough that a strip of the previous and next card peeks in at each edge.
  const cardWidth = Math.min(300, Math.round(screen * 0.7));
  const cardHeight = Math.round(cardWidth * 1.3);
  const side = (screen - cardWidth) / 2;
  const scrollX = useSharedValue(0);
  const [broken, setBroken] = useState<Set<number>>(new Set());
  const shown = useMemo(() => items.filter((i) => !broken.has(i.TermId)), [items, broken]);
  const onScroll = useAnimatedScrollHandler((e) => { scrollX.value = e.contentOffset.x; });
  const markBroken = (id: number) => setBroken((prev) => new Set(prev).add(id));

  if (shown.length === 0) return null;
  // Its own fade-in: a flattened (hardware-layer) wrapper would cut the glow off at the edges.
  return (
    <Animated.View entering={FadeInDown.duration(450).delay(60).reduceMotion(ReduceMotion.System)} style={{ marginHorizontal: -18 }}>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + GAP}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: side, paddingTop: 8, paddingBottom: 34 }}
        accessibilityLabel="Illustrations"
      >
        {shown.map((item, index) => (
          <Card key={item.TermId} item={item} index={index} width={cardWidth} height={cardHeight} scrollX={scrollX} onOpen={onOpen} onBroken={markBroken} />
        ))}
      </Animated.ScrollView>
      {shown.length > 1 && (
        <S.View className="flex-row justify-center -mt-3" accessibilityElementsHidden>
          {shown.map((item, index) => <Dot key={item.TermId} index={index} step={cardWidth + GAP} scrollX={scrollX} />)}
        </S.View>
      )}
    </Animated.View>
  );
};
