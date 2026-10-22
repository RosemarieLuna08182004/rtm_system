import { SFC } from "@/types";
import React, { useRef, useState, useCallback, useMemo } from "react";
import { useWindowDimensions, FlatList, View, StyleSheet, Image, Alert, Animated } from "react-native";
import { slides } from "@/shared";
import { useRouter } from "expo-router";
import * as S from '@/styles';
import { ONBOARDING_SEEN_KEY, RoutesChannel } from "@/constants";
import { setItem } from "@/utils/asyncStorage";
import { useThemeColors } from "@/context/PreferencesProvider";
import { useAuth } from "@/hooks";
import { Error, ErrorTitle } from "@/shared";

export const OnBoardingCon: SFC = () => {
  const { auth } = useAuth();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const theme = useThemeColors();

  const scaleFactor = width / 320;
  const responsiveFontSize = useCallback((size: number) => {
    return Math.round(size * scaleFactor);
  }, [scaleFactor]);

  const onboard = useCallback(async () => {
    try {
      // Seen once is enough; next launch goes straight to Home or Sign In.
      await setItem(ONBOARDING_SEEN_KEY, 'true');
      if (auth?.accessToken) {
        router.replace(RoutesChannel.HOME);
      } else {
        router.replace(RoutesChannel.SIGN_IN);
      }
    } catch (error) {
      Alert.alert(ErrorTitle.m0001, Error.m0001);
    }
  }, [auth?.accessToken, router]);

  const handleStart = useCallback(() => {
    onboard();
  }, [onboard]);

  const startButtonText = useMemo(() => {
    return auth?.accessToken ? "Explore Dashboard" : "Start Learning";
  }, [auth?.accessToken]);

  const isLastSlide = currentIndex === slides.length - 1;

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  }), [width]);

  const renderItem = useCallback(({ item }: { item: any; index: number }) => {
    const imageSize = responsiveFontSize(230);
    const paddingTop = responsiveFontSize(30);
    const paddingBottom = responsiveFontSize(30);

    return (
      <View style={[styles.item, { width }]}>
        <View style={{ paddingTop }}>
          <Image 
            source={item.Image} 
            style={[styles.image, { width: imageSize, height: imageSize }]} 
            resizeMode="contain"
          />
        </View>
        <View style={[styles.titleContainer, { paddingBottom }]}>
          <S.Text className="text-3xl font-pbold text-blue-700 dark:text-blue-300 text-center">{item.Title}</S.Text>
          <S.Text className="text-sm font-pregular text-gray-600 dark:text-slate-300 text-center px-8 mt-2 leading-5">{item.Description}</S.Text>
        </View>
      </View>
    );
  }, [width, responsiveFontSize]);

  const onMomentumScrollEnd = useCallback((event: any) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    if (slideIndex !== currentIndex) {
      setCurrentIndex(slideIndex);
    }
  }, [width, currentIndex]);

  const onScrollToIndexFailed = useCallback((info: any) => {
    flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
  }, []);

  const Paginator = () => {
    return (
      <View style={styles.paginatorContainer}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View 
              style={[styles.dot, { width: dotWidth, opacity }]} 
              key={i.toString()} 
            />
          );
        })}
      </View>
    );
  };

  return (
    <S.View style={[styles.container, { backgroundColor: theme.surface }]}>
      {!isLastSlide && (
        <S.TouchableOpacity
          onPress={handleStart}
          style={[styles.skipButton, { top: responsiveFontSize(16), right: 20 }]}
          accessibilityRole="button"
          accessibilityLabel="Skip introduction"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <S.Text style={[styles.skipText, { color: theme.mutedText }]}>Skip</S.Text>
        </S.TouchableOpacity>
      )}
      <View style={[styles.top, { paddingTop: responsiveFontSize(80), backgroundColor: theme.surface }]}>
        <Animated.FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.Id.toString()}
          getItemLayout={getItemLayout}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollToIndexFailed={onScrollToIndexFailed}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          renderItem={renderItem}
          windowSize={3}
          initialNumToRender={2}
          maxToRenderPerBatch={1}
          removeClippedSubviews={true}
        />
      </View>

      <View style={[styles.bottom, { marginBottom: responsiveFontSize(13), backgroundColor: theme.surface }]}>
        {!isLastSlide ? (
          <Paginator />
        ) : (
          <S.TouchableOpacity style={styles.button} onPress={handleStart}>
            <S.Text className="text-white font-pbold text-base">{startButtonText}</S.Text>
          </S.TouchableOpacity>
        )}
      </View>
    </S.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  top: {
    flex: 0.9,
    backgroundColor: 'white',
  },
  bottom: {
    flex: 0.2,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#1B42CE',
    padding: 18,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    width: '70%',
  },
  buttonOutline: {
    padding: 10,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B42CE',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  description: {
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 32,
    marginTop: 6,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 15,
  },
  skipButton: {
    position: 'absolute',
    zIndex: 1,
  },
  skipText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
  },
  logo: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 50,
    height: 50,
  },
  paginatorContainer: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1B42CE',
    marginHorizontal: 8,
  },
});
