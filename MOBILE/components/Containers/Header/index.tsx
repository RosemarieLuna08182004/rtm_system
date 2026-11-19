import { HeaderProps, SFC } from "@/types";
import React from "react";
import { RLogoWhiteIcon } from "@/constants/icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import * as S from '@/styles'
import { useRouter } from "expo-router";

export const Header: SFC<HeaderProps> = ({ ClassName, tintColor, ToggleFetch, title }) => {
	const router = useRouter();

	return (
		<S.View className={`bg-blue-700 items-center py-2 ${ClassName}`}>
			<S.View className="w-screen h-14">
				<S.View className="flex flex-row justify-between items-center w-full px-3">
					<S.View className="flex-1 flex-row items-center">
						<S.Image source={RLogoWhiteIcon} className="w-[40] h-[40] ml-3" tintColor={tintColor??""} />
						{title && (
							<>
								<S.View className="h-6 w-px bg-white/50 mx-3" />
								<S.Text 
									className="text-white text-xl font-pbold"
									style={styles.titleText}
								>
									{title}
								</S.Text>
							</>
						)}
					</S.View>

					<TouchableOpacity 
						onPress={() => router.replace('/')}
						className="bg-white/20 px-3 py-1.5 rounded-full border border-white/30 mr-4"
					>
						<S.Text className="text-white text-xs font-pbold">About the Author</S.Text>
					</TouchableOpacity>
				</S.View>
			</S.View>
		</S.View>
	)
}

const styles = StyleSheet.create({
	titleText: {
		textShadowColor: 'rgba(0, 0, 0, 0.3)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
});
