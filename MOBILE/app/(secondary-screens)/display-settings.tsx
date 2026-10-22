import React from "react"
import { Switch } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as S from '@/styles'
import { SecondaryHeader } from "@/components"
import { DISPLAY_SCALES, RequireAuth, ThemePreference, usePreferences } from "@/context"

const THEMES: { value: ThemePreference; label: string; hint: string }[] = [
	{ value: 'system', label: 'System', hint: 'Follow the phone' },
	{ value: 'light', label: 'Light', hint: 'Always light' },
	{ value: 'dark', label: 'Dark', hint: 'Easier at night' },
]

// Display size (zoom) and theme for people who need larger text or a darker screen.
export default function DisplaySettingsScreen() {
	const { displayScale, setDisplayScale, zoomIn, zoomOut, theme, setTheme, pinchZoom, setPinchZoom, isDark } = usePreferences()
	const percent = Math.round(displayScale * 100)
	const atMin = displayScale <= DISPLAY_SCALES[0]
	const atMax = displayScale >= DISPLAY_SCALES[DISPLAY_SCALES.length - 1]

	return (
		<RequireAuth>
			<S.View className="flex-1 bg-slate-100 dark:bg-slate-950">
				<S.SafeAreaView edges={['top']} className="bg-blue-700 py-0">
					<SecondaryHeader title="Display & comfort" />
				</S.SafeAreaView>

				<S.ScrollView className="flex-1 px-4 py-5" contentContainerStyle={{ paddingBottom: 40 }}>
					{/* Live preview */}
					<S.View className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
						<S.Text className="text-xs uppercase tracking-wider font-pbold text-blue-700 dark:text-blue-300">Preview</S.Text>
						<S.Text className="text-2xl font-pbold text-slate-800 dark:text-slate-100 mt-2">Cardiomyopathy</S.Text>
						<S.Text className="text-base font-pregular text-slate-600 dark:text-slate-300 mt-1">
							Kardia (heart) + Myo (muscle) + -pathy (disease): a disease of the heart muscle.
						</S.Text>
					</S.View>

					{/* Display size */}
					<S.Text className="mt-6 mb-2 text-xs uppercase tracking-wider font-pbold text-slate-500 dark:text-slate-400" accessibilityRole="header">
						Display size
					</S.Text>
					<S.View className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
						<S.View className="flex-row items-center justify-between">
							<S.TouchableOpacity
								onPress={zoomOut}
								disabled={atMin}
								className={`h-14 w-14 rounded-full items-center justify-center ${atMin ? 'bg-slate-100 dark:bg-slate-800' : 'bg-blue-700'}`}
								accessibilityRole="button"
								accessibilityLabel="Zoom out, smaller text"
								accessibilityState={{ disabled: atMin }}
							>
								<S.Text className={`text-lg font-pbold ${atMin ? 'text-slate-400' : 'text-white'}`}>A−</S.Text>
							</S.TouchableOpacity>
							<S.View className="items-center" accessibilityLiveRegion="polite">
								<S.Text className="text-3xl font-pbold text-slate-800 dark:text-slate-100">{percent}%</S.Text>
								<S.Text className="text-xs font-pregular text-slate-500 dark:text-slate-400">{percent === 100 ? 'Default' : percent > 100 ? 'Larger' : 'Smaller'}</S.Text>
							</S.View>
							<S.TouchableOpacity
								onPress={zoomIn}
								disabled={atMax}
								className={`h-14 w-14 rounded-full items-center justify-center ${atMax ? 'bg-slate-100 dark:bg-slate-800' : 'bg-blue-700'}`}
								accessibilityRole="button"
								accessibilityLabel="Zoom in, larger text"
								accessibilityState={{ disabled: atMax }}
							>
								<S.Text className={`text-2xl font-pbold ${atMax ? 'text-slate-400' : 'text-white'}`}>A+</S.Text>
							</S.TouchableOpacity>
						</S.View>

						<S.View className="flex-row flex-wrap justify-center mt-4">
							{DISPLAY_SCALES.map((scale) => {
								const selected = scale === displayScale
								return (
									<S.TouchableOpacity
										key={scale}
										onPress={() => setDisplayScale(scale)}
										className={`m-1 px-3 py-2 rounded-full border ${selected ? 'bg-blue-700 border-blue-700' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'}`}
										accessibilityRole="button"
										accessibilityLabel={`Display size ${Math.round(scale * 100)} percent`}
										accessibilityState={{ selected }}
									>
										<S.Text className={`text-sm font-psemibold ${selected ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>{Math.round(scale * 100)}%</S.Text>
									</S.TouchableOpacity>
								)
							})}
						</S.View>
						<S.Text className="text-xs font-pregular text-slate-500 dark:text-slate-400 mt-3 text-center">
							Changes the text size on every screen. Your phone’s own font size setting also applies.
						</S.Text>
					</S.View>

					{/* Pinch to zoom */}
					<S.Text className="mt-6 mb-2 text-xs uppercase tracking-wider font-pbold text-slate-500 dark:text-slate-400" accessibilityRole="header">
						Screen zoom
					</S.Text>
					<S.View className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
						<S.View className="flex-row items-center">
							<S.View className="h-12 w-12 rounded-xl items-center justify-center bg-blue-50 dark:bg-slate-800">
								<MaterialCommunityIcons name="gesture-pinch" size={26} color={isDark ? '#93c5fd' : '#1d4ed8'} />
							</S.View>
							<S.View className="flex-1 mx-3">
								<S.Text className="text-base font-psemibold text-slate-800 dark:text-slate-100">Pinch to zoom any screen</S.Text>
								<S.Text className="text-xs font-pregular text-slate-500 dark:text-slate-400 mt-0.5">Spread two fingers to magnify up to 300%. Drag with two fingers to move around.</S.Text>
							</S.View>
							<Switch
								value={pinchZoom}
								onValueChange={setPinchZoom}
								trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
								thumbColor={pinchZoom ? '#1d4ed8' : '#f8fafc'}
								accessibilityLabel="Pinch to zoom any screen"
							/>
						</S.View>
						{pinchZoom && (
							<S.Text className="text-xs font-pregular text-slate-500 dark:text-slate-400 mt-3">
								While zoomed, use the bar at the bottom of the screen to zoom in, zoom out or go back to 100%.
							</S.Text>
						)}
					</S.View>

					{/* Theme */}
					<S.Text className="mt-6 mb-2 text-xs uppercase tracking-wider font-pbold text-slate-500 dark:text-slate-400" accessibilityRole="header">
						Theme
					</S.Text>
					<S.View className="flex-row rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1">
						{THEMES.map((option) => {
							const selected = option.value === theme
							return (
								<S.TouchableOpacity
									key={option.value}
									onPress={() => setTheme(option.value)}
									className={`flex-1 items-center py-3 rounded-xl ${selected ? 'bg-blue-700' : ''}`}
									accessibilityRole="radio"
									accessibilityLabel={`${option.label} theme, ${option.hint}`}
									accessibilityState={{ selected }}
								>
									<S.Text className={`text-base font-psemibold ${selected ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>{option.label}</S.Text>
									<S.Text className={`text-[11px] font-pregular ${selected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>{option.hint}</S.Text>
								</S.TouchableOpacity>
							)
						})}
					</S.View>

					{(displayScale !== 1 || theme !== 'system' || !pinchZoom) && (
						<S.TouchableOpacity
							onPress={() => { setDisplayScale(1); setTheme('system'); setPinchZoom(true) }}
							className="mt-6 items-center py-3"
							accessibilityRole="button"
						>
							<S.Text className="text-base font-psemibold text-blue-700 dark:text-blue-300">Reset to default</S.Text>
						</S.TouchableOpacity>
					)}
				</S.ScrollView>
			</S.View>
		</RequireAuth>
	)
}
