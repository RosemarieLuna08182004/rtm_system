import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

export const SkeletonButton = () => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const interpolateBackground = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#f8f8f8'],
  });

  return (
    <Animated.View style={[styles.button, { backgroundColor: interpolateBackground }]}>
      <View style={styles.buttonContent} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 70,
    width: '100%',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  buttonContent: {
    height: 20,
    width: '60%',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});

