import { GestureHandlerRootView as ghrv } from 'react-native-gesture-handler';
import { SafeAreaView as sav } from 'react-native-safe-area-context';
import { View as v, FlatList as fl, Image as img, ActivityIndicator as ai, Animated as an, ScrollView as sv } from "react-native";
// Text and TextInput follow the in-app display size (Settings → Display & comfort).
import { ScaledText as t, ScaledTextInput as ti } from "./ScaledText";
// Buttons shrink slightly when pressed.
import { PressableScale as to } from './PressableScale';
import { LinearGradient as lg } from "expo-linear-gradient";
import mv from '@react-native-masked-view/masked-view';
import iv from "react-native-image-viewing";
import { WebView as w } from "react-native-webview";
import { Tabs as tbs } from "expo-router";

export const SafeAreaView = sav;
export const GestureHandlerRootView = ghrv;
export const View = v;
export const Text = t;
export const LinearGradient = lg;
export const MaskedView = mv;
export const TouchableOpacity = to;
export const FlatList = fl;
export const Image = img;
export const ActivityIndicator = ai;
export const Tabs = tbs;
export const TextInput = ti;
export const WebView = w;
export const Animated = an.View;
export const ImageView = iv;
export const ScrollView = sv;
