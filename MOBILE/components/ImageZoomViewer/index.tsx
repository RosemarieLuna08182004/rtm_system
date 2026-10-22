import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Image, StatusBar, Platform } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

interface ImageZoomViewerProps {
  images: Array<{ uri: string }>;
  children: React.ReactNode;
  imageIndex?: number;
}

const ImageZoomViewer: React.FC<ImageZoomViewerProps> = ({
  images,
  children,
  imageIndex = 0,
}) => {
  const [visible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(imageIndex);

  // Preload images for faster loading
  useEffect(() => {
    images.forEach((image) => {
      Image.prefetch(image.uri);
    });
  }, [images]);

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsVisible(true);
    StatusBar.setHidden(true, 'fade');
  };

  const closeImageViewer = () => {
    setIsVisible(false);
    StatusBar.setHidden(false, 'fade');
  };



  return (
    <>
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={() => openImageViewer(imageIndex)}
        style={styles.container}
        accessibilityRole="imagebutton"
        accessibilityLabel="Illustration"
        accessibilityHint="Opens the image full screen"
      >
        {children}
      </TouchableOpacity>

      {visible && (
        <StatusBar
          barStyle="light-content"
          backgroundColor="black"
          translucent={true}
          hidden={Platform.OS === 'ios'}
        />
      )}
      <ImageViewing
        images={images}
        imageIndex={currentImageIndex}
        visible={visible}
        onRequestClose={closeImageViewer}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
        backgroundColor="black"
        presentationStyle="overFullScreen"
        animationType="fade"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ImageZoomViewer;
