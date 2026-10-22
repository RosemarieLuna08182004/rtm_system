import React, { useMemo, useRef } from "react";
import * as S from '@/styles';
import { useRouter } from "expo-router";
import { LeftArrow } from "@/constants";
import { Animated, ViewStyle, StyleSheet, View } from "react-native";
import { SecondaryHeaderProps, SFC } from "@/types";
import { BookmarkButton } from "@/components/FormInputs";
import { useDisplayScale } from "@/utils/displayScale";

interface ExtendedSecondaryHeaderProps extends SecondaryHeaderProps {
    style?: ViewStyle;
    onBackPress?: () => void;
}

export const SecondaryHeader: SFC<ExtendedSecondaryHeaderProps> = ({
    title,
    subtitle,
    termStatus,
    userTermsId,
    termId,
    isTermLine = false,
    ClassName = '',
    style,
    onBackPress,
}) => {
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;

    // Taller when there's a subtitle, and grows with the display size so large text isn't clipped.
    const displayScale = useDisplayScale();
    const Header_Max_Height = useMemo(
        () => Math.round((isTermLine || subtitle ? 70 : 50) * displayScale),
        [isTermLine, subtitle, displayScale],
    );
    const Header_Min_Height = Math.round(45 * displayScale);
    const Scroll_Distance = 25;

    const animatedHeaderHeight = useMemo(() => scrollY.interpolate({
        inputRange: [0, Scroll_Distance],
        outputRange: [Header_Max_Height, Header_Min_Height],
        extrapolate: 'clamp',
    }), [scrollY, Scroll_Distance, Header_Max_Height, Header_Min_Height]);

    const subtitleOpacity = useMemo(() => scrollY.interpolate({
        inputRange: [0, Scroll_Distance * 0.7],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    }), [scrollY, Scroll_Distance]);

    const trimmedTitle = title?.trim() || '';
    const trimmedSubtitle = subtitle?.trim();
    const tintColor = S.colors.white;

    const containerStyle = useMemo<ViewStyle>(
        () => ({
            ...style,
        }),
        [style]
    );

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    const renderBookmarkButton = () => {
        if (!subtitle || !termId) return null;
        
        return (
            <BookmarkButton 
                Status={termStatus} 
                TermId={termId} 
                UserTermsId={userTermsId} 
                ClassName="!w-auto !h-auto !pr-0 flex justify-center items-center p-2"
                NoLoading={true}
            />
        );
    };

    return (
        <S.Animated 
            style={[
                styles.container,
                containerStyle,
                { height: animatedHeaderHeight }
            ]} 
            className={`z-50 mv-10 ${ClassName}`}
        >
            <S.View className="pl-6 pr-4 h-full flex-row items-center justify-between w-full bg-blue-700">
                    <S.TouchableOpacity 
                        onPress={handleBackPress} 
                        className="p-2 rounded-full"
                        style={styles.backButton}
                        accessibilityLabel="Go back"
                        accessibilityRole="button"
                    >
                        <S.Image 
                            source={LeftArrow} 
                            className="w-5 h-5" 
                            tintColor={tintColor} 
                            accessibilityIgnoresInvertColors
                        />
                    </S.TouchableOpacity>

                    <S.View className="flex-1 px-4 flex-shrink">
                        <S.Text 
                            className="text-lg font-pbold text-white" 
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.titleText}
                        >
                            {trimmedTitle}
                        </S.Text>
                    
                        {trimmedSubtitle && (
                            <View>
                                <S.Animated
                                    style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}
                                >
                                    <S.Text 
                                        className="text-base text-blue-100 mt-0" 
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={styles.subtitleText}
                                    >
                                        {trimmedSubtitle}
                                    </S.Text>
                                </S.Animated>
                            </View>
                        )}
                </S.View>

                    <S.View style={styles.rightSection}>
                        {renderBookmarkButton()}
                    </S.View>
                </S.View>
        </S.Animated>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    backButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    titleText: {
    },
    subtitleText: {
        fontFamily: 'Poppins_400Regular',
    },
    subtitleContainer: {
    },
    rightSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
});
