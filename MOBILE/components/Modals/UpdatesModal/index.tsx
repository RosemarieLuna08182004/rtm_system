import React from 'react';
import { Modal, Dimensions } from 'react-native';
import * as S from '@/styles';
import { TouchableButton } from '@/components/FormInputs';

interface UpdatesModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export const UpdatesModal: React.FC<UpdatesModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <S.View className="flex-1 bg-black/50 justify-center items-center px-6">
        <S.View 
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm"
          style={{ maxWidth: width * 0.9 }}
        >
          {/* Header */}
          <S.View className="mb-4">
            <S.Text className="text-xl font-pbold text-blue-700 dark:text-blue-300">
              What's New! 🎉
            </S.Text>
          </S.View>

          {/* Content */}
          <S.View className="mb-6">
            <S.Text className="text-base font-pmedium text-gray-800 dark:text-slate-100 mb-3">
              New Features & Improvements
            </S.Text>
            
            <S.View className="space-y-3">
              <S.View className="flex-row items-start">
                <S.Text className="text-blue-600 dark:text-blue-400 font-pbold mr-2">•</S.Text>
                <S.Text className="text-sm font-pregular text-gray-700 dark:text-slate-200 flex-1">
                  Enhanced onboarding experience with updated author information
                </S.Text>
              </S.View>
              
              <S.View className="flex-row items-start">
                <S.Text className="text-blue-600 dark:text-blue-400 font-pbold mr-2">•</S.Text>
                <S.Text className="text-sm font-pregular text-gray-700 dark:text-slate-200 flex-1">
                  Improved error messages with better visual feedback
                </S.Text>
              </S.View>
              
              <S.View className="flex-row items-start">
                <S.Text className="text-blue-600 dark:text-blue-400 font-pbold mr-2">•</S.Text>
                <S.Text className="text-sm font-pregular text-gray-700 dark:text-slate-200 flex-1">
                  New navigation options to easily access onboarding
                </S.Text>
              </S.View>
              
              <S.View className="flex-row items-start">
                <S.Text className="text-blue-600 dark:text-blue-400 font-pbold mr-2">•</S.Text>
                <S.Text className="text-sm font-pregular text-gray-700 dark:text-slate-200 flex-1">
                  Performance improvements and bug fixes
                </S.Text>
              </S.View>
            </S.View>
          </S.View>

          {/* Footer */}
          <TouchableButton
            OnPress={onClose}
            Text="Got it!"
            BgStyle="bg-blue-700"
            TextStyle="text-white font-pbold"
            ClassName="w-full"
          />
        </S.View>
      </S.View>
    </Modal>
  );
};
