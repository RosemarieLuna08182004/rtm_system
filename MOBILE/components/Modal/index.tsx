import React, { useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import * as S from '@/styles'
import { ModalComponentProps, SFC } from '@/types';

const { height: screenHeight } = Dimensions.get('window');

export const ModalComponent: SFC<ModalComponentProps> = ({
  isVisible,
  onClose,
  title,
  content,
  leftButtonLabel,
  rightButtonLabel,
  onLeftButtonPress,
  onRightButtonPress,
}) => {
  const translateY = new Animated.Value(100);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <Modal 
      isVisible={isVisible} 
      onBackdropPress={onClose}
      backdropOpacity={0.8}
      style={{ margin: 0, justifyContent: 'center', alignItems: 'center' }}
      deviceHeight={screenHeight}
      statusBarTranslucent
      coverScreen={true}
      hasBackdrop={true}
      useNativeDriver={true}
    >
      <S.Animated 
        className="bg-white dark:bg-slate-900 p-6 rounded-2xl items-center shadow-xl mx-6 max-w-sm w-full" 
        style={{ transform: [{ translateY }] }}
      >
        <S.Text className="text-xl font-pbold mb-3 text-gray-800 dark:text-slate-100 text-center">{title}</S.Text>
        <S.Text className="mb-6 font-pregular text-base text-gray-600 dark:text-slate-300 text-center leading-6">{content}</S.Text>
        <S.View className="flex-col w-full gap-3">
          {rightButtonLabel && (
            <S.TouchableOpacity
              className="bg-blue-700 py-4 px-6 w-full rounded-xl"
              onPress={() => {onRightButtonPress()}}
              activeOpacity={0.8}
            >
              <S.Text className="text-white text-center font-pbold text-base">{rightButtonLabel}</S.Text>
            </S.TouchableOpacity>
          )}
          {leftButtonLabel && (
            <S.TouchableOpacity
              className="bg-gray-100 dark:bg-slate-950 py-4 px-6 rounded-xl w-full border border-gray-200 dark:border-slate-700"
              onPress={() => onLeftButtonPress?onLeftButtonPress():onClose()}
              activeOpacity={0.8}
            >
              <S.Text className="text-gray-700 dark:text-slate-200 text-center font-pmedium text-base">{leftButtonLabel}</S.Text>
            </S.TouchableOpacity>
          )}
        </S.View>
      </S.Animated>
    </Modal>
  );
};