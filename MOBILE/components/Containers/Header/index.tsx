import { HeaderProps, SFC } from "@/types";
import React from "react";
import { RLogoWhiteIcon } from "@/constants/icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as S from '@/styles'
import { useRouter } from "expo-router";

// Blue tab header: R logo | screen title, and the "About the Author" pill.
export const Header: SFC<HeaderProps> = ({ ClassName, tintColor, title }) => {
	const router = useRouter();

	return (
		<S.View className={`bg-blue-700 ${ClassName ?? ''}`}>
			<S.LinearGradient
				colors={['#1d4ed8', '#1d4ed8', '#2563eb']}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{ paddingVertical: 12, paddingHorizontal: 18 }}
			>
				<S.View className="flex-row items-center min-h-14">
					<S.View className="flex-1 flex-row items-center">
						<S.Image source={RLogoWhiteIcon} className="w-[44px] h-[44px]" resizeMode="contain" tintColor={tintColor ?? ""} />
						{title && (
							<>
								<S.View className="h-8 w-px bg-white/50 mx-4" />
								<S.Text
									className="flex-shrink text-white text-2xl font-pbold"
									style={styles.titleText}
									numberOfLines={1}
									accessibilityRole="header"
								>
									{title}
								</S.Text>
							</>
						)}
					</S.View>

					<TouchableOpacity
						onPress={() => router.push('/?showOnboarding=true')}
						accessibilityRole="button"
						accessibilityLabel="About the Author"
						className="flex-row items-center bg-white/20 px-4 py-2.5 rounded-full border border-white/30 ml-2"
					>
						<MaterialCommunityIcons name="account" size={18} color="#ffffff" />
						<S.Text className="text-white text-xs font-psemibold ml-1.5">About the Author</S.Text>
					</TouchableOpacity>
				</S.View>
			</S.LinearGradient>
		</S.View>
	)
}

const styles = StyleSheet.create({
	titleText: {
		textShadowColor: 'rgba(0, 0, 0, 0.2)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
});
