import { Dimensions, PixelRatio } from "react-native";

const getScreenData = () => {
  const { width, height } = Dimensions.get("window");
  return {
    width,
    height,
    shortDimension: Math.min(width, height),
    longDimension: Math.max(width, height),
  };
};

const DEVICE_SIZES = {
  SMALL_PHONE: 375,   // e.g. compact Android phones
  REGULAR_PHONE: 390, // typical Android baseline
  LARGE_PHONE: 428,   // large Android devices
  TABLET: 768,        // keep tablet logic in case
};

export const responsiveFontSize = (size: number): number => {
  const { shortDimension } = getScreenData();

  let baseWidth: number;
  let scaleFactor: number;

  if (shortDimension <= DEVICE_SIZES.SMALL_PHONE) {
    baseWidth = DEVICE_SIZES.SMALL_PHONE;
    scaleFactor = shortDimension / baseWidth;
  } else if (shortDimension <= DEVICE_SIZES.REGULAR_PHONE) {
    baseWidth = DEVICE_SIZES.REGULAR_PHONE;
    scaleFactor = shortDimension / baseWidth;
  } else if (shortDimension <= DEVICE_SIZES.LARGE_PHONE) {
    baseWidth = DEVICE_SIZES.LARGE_PHONE;
    scaleFactor = shortDimension / baseWidth;
  } else {
    baseWidth = DEVICE_SIZES.TABLET;
    scaleFactor = Math.min(shortDimension / baseWidth, 1.3);
  }

  const pixelRatio = PixelRatio.get();
  const densityAdjustment = pixelRatio <= 2 ? 1 : pixelRatio / 2.5;

  let responsiveSize = size * scaleFactor * densityAdjustment;

  const minSize = size * 0.7;
  const maxSize = size * 1.5;

  return Math.round(Math.max(minSize, Math.min(maxSize, responsiveSize)));
};

export const responsiveDimension = (dimension: number): number => {
  const { shortDimension } = getScreenData();
  const baseWidth = DEVICE_SIZES.REGULAR_PHONE;
  const scaleFactor = shortDimension / baseWidth;

  const responsiveDimension = dimension * scaleFactor;
  const minDimension = dimension * 0.5;
  const maxDimension = dimension * 2;

  return Math.round(Math.max(minDimension, Math.min(maxDimension, responsiveDimension)));
};

export const getBottomNavigationPadding = (): number => {
  return responsiveDimension(70);
};

export const getSafeBottomPadding = (baseSize: number = 80): number => {
  return responsiveDimension(baseSize - 10);
};
