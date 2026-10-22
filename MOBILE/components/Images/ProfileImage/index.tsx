import React from 'react';
import {
Image as RNImage,
View,
TouchableOpacity,
Modal,
StyleProp,
ViewStyle,
ImageStyle,
ImageSourcePropType
} from 'react-native';
import * as S from '@/styles';
import { ProfilePictureProps, SFC } from '@/types';
import { useToggle } from '@/hooks';

export const ProfilePicture: SFC<ProfilePictureProps> = ({ 
  imageUri, 
  size = 160,
  onPress,
  showEditButton = true,
  borderWidth = 4,
  borderColor = 'white'
}) => {
  const [visible, toggle] = useToggle(false);
  
  const containerStyle: StyleProp<ViewStyle> = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth,
    borderColor,
    backgroundColor: 'white',
    overflow: 'hidden' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  const imageStyle: StyleProp<ImageStyle> = {
    width: '100%',
    height: '100%',
    borderRadius: size / 2,
  };

  const editButtonStyle: StyleProp<ViewStyle> = {
    position: 'absolute' as const,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      toggle();
    }
  };

  // Base64 encoded placeholder avatar (1x1 transparent pixel)
  const placeholderAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  
  // Ensure we have a valid image source
  const imageSource: ImageSourcePropType = imageUri && imageUri !== 'NA' 
    ? { uri: imageUri } 
    : { uri: placeholderAvatar };

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity 
        onPress={handlePress}
        style={containerStyle}
        activeOpacity={0.8}
        accessibilityRole="imagebutton"
        accessibilityLabel="Profile picture"
        accessibilityHint={onPress ? "Opens edit profile" : undefined}
      >
        <RNImage 
          source={imageSource} 
          style={imageStyle}
          resizeMode="cover"
        />
      </TouchableOpacity>
      
      {showEditButton && (
        <TouchableOpacity 
          style={editButtonStyle}
          onPress={handlePress}
          accessibilityLabel="Edit profile picture"
        >
          {/* Edit icon will be added by the parent */}
        </TouchableOpacity>
      )}
      
      <Modal
        visible={visible}
        transparent={true}
        onRequestClose={toggle}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <TouchableOpacity 
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              padding: 10,
            }}
            onPress={toggle}
          >
            <S.Text style={{ color: 'white', fontSize: 18 }}>Close</S.Text>
          </TouchableOpacity>
          <RNImage 
            source={imageSource} 
            style={{ 
              width: '90%',
              aspectRatio: 1,
              borderRadius: 10,
            }}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

export const ImageViewer: SFC<ProfilePictureProps> = ({ imageUri = "NA" }) => {
  const [visible, toggle] = useToggle(false);
  
  // Use the same base64 placeholder for consistency
  const placeholderAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  
  // Ensure we have a valid image source
  const imageSource = imageUri && imageUri !== "NA" 
    ? { uri: imageUri } 
    : { uri: placeholderAvatar };
  
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 12, width: '100%' }}>
      <TouchableOpacity 
        onPress={toggle} 
        style={{
          paddingHorizontal: 12,
          flex: 1,
          position: 'relative',
          width: '100%',
          height: 300, // Fixed height instead of viewport units
        }}
      >
        <RNImage 
          source={imageSource} 
          style={{
            height: 300, // Fixed height instead of viewport units
            width: '100%', // Use percentage for width
            paddingHorizontal: 12,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
      
      <Modal
        visible={visible}
        transparent={true}
        onRequestClose={toggle}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <TouchableOpacity 
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              padding: 10,
            }}
            onPress={toggle}
          >
            <S.Text style={{ color: 'white', fontSize: 18 }}>Close</S.Text>
          </TouchableOpacity>
          <RNImage 
            source={imageSource} 
            style={{ 
              width: '90%',
              aspectRatio: 1,
              borderRadius: 10,
            }}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};
