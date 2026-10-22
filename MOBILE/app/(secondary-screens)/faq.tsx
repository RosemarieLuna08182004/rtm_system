import React, { useMemo, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Animated, { FadeIn, LinearTransition, ReduceMotion } from "react-native-reanimated"
import * as S from '@/styles'
import { FadeInItem } from "@/components/Motion"
import { GradientHeader } from "@/components/Containers/GradientHeader"
import { RequireAuth, usePreferences } from "@/context"
import { normalizeText } from "@/utils/fuzzySearch"

interface Faq {
	q: string
	a: string
}

const FAQS: { section: string; items: Faq[] }[] = [
	{
		section: 'Getting started',
		items: [
			{ q: 'What is Roots and Morphology?', a: 'It helps you learn medical and anatomy terms by breaking each one into its parts (roots, prefixes and suffixes) and explaining what each part means. Once you know the parts, you can work out the meaning of many new words on your own.' },
			{ q: 'How do I find a term?', a: 'Tap the search bar on Home to search every volume at once. Small spelling mistakes are fine. You can also open Volumes, pick a subject, and search inside its term list.' },
			{ q: 'What does “Continue where you left off” show?', a: 'The last term you opened, so you can jump straight back in. The terms you opened before it appear as chips under the card.' },
		],
	},
	{
		section: 'Studying a term',
		items: [
			{ q: 'What are word parts?', a: 'The chips at the top of a term, e.g. Ad (to) + Ren (the kidney) + -al. Tap a root to see every other term that uses it. Hold any part to hear it spoken.' },
			{ q: 'How do I hear how a term is pronounced?', a: 'Tap the speaker button on the Word parts card. It uses your phone’s text-to-speech voice. If you don’t see the button, your phone has no speech voice installed. You can add one in your phone’s Settings under Text-to-speech.' },
			{ q: 'Can I write my own notes?', a: 'Yes. Tap “+ Add” on the My note card of any term. Notes are saved on this phone only, so they won’t appear if you sign in on another device.' },
			{ q: 'How do I zoom into the illustration?', a: 'Tap the picture to open it full screen, then pinch to zoom.' },
		],
	},
	{
		section: 'Bookmarks',
		items: [
			{ q: 'How do I bookmark a term?', a: 'Tap the bookmark icon on a term in the list, or at the top right of the term screen. All your bookmarks are in the Bookmarks tab, grouped by volume.' },
			{ q: 'Why is a volume or term locked?', a: 'Locked volumes and terms aren’t available to your account yet. They open automatically once they’re unlocked for you.' },
		],
	},
	{
		section: 'Comfort and accessibility',
		items: [
			{ q: 'Can I make the text bigger?', a: 'Yes. Go to Profile → Display & Comfort and choose a display size from 90% to 175%. It changes the text on every screen.' },
			{ q: 'How do I zoom in on a screen?', a: 'Spread two fingers on any screen to magnify it up to 300%, and drag with two fingers to move around. A bar at the bottom lets you zoom in, zoom out or reset. You can turn this off in Display & Comfort.' },
			{ q: 'Is there a dark mode?', a: 'Yes. In Display & Comfort choose Dark, Light, or System to follow your phone.' },
			{ q: 'How do I add the home-screen widget?', a: 'On Android, touch and hold an empty spot on your home screen, tap Widgets, find Roots and Morphology, and drag the widget onto your home screen. It shows a term of the day and your last viewed term. Open the app once after adding it so it can load your terms.' },
		],
	},
	{
		section: 'Account',
		items: [
			{ q: 'I forgot my password. What do I do?', a: 'On the sign-in screen tap “Forgot password”, enter your email, and we’ll send you a code to set a new password.' },
			{ q: 'How do I change my password?', a: 'Go to Profile → Settings → Change password. You’ll need your current password.' },
			{ q: 'How do I edit my name or photo?', a: 'On Profile, tap the pencil button on your picture.' },
			{ q: 'Does the app work offline?', a: 'You need an internet connection to load terms. If the connection drops, the app shows a notice and carries on where you were when you’re back online.' },
		],
	},
]

// Common questions, grouped and searchable. Tap a question to open its answer.
export default function FaqScreen() {
	const insets = useSafeAreaInsets()
	const { isDark } = usePreferences()
	const [open, setOpen] = useState<string | null>(null)
	const [query, setQuery] = useState('')
	const muted = isDark ? '#64748b' : '#94a3b8'
	const accent = isDark ? '#93c5fd' : '#2563eb'

	const sections = useMemo(() => {
		const q = normalizeText(query)
		if (!q) return FAQS
		return FAQS
			.map((s) => ({ ...s, items: s.items.filter((f) => normalizeText(`${f.q} ${f.a}`).includes(q)) }))
			.filter((s) => s.items.length > 0)
	}, [query])

	let index = 0
	return (
		<RequireAuth>
			<S.View className="flex-1 bg-slate-50 dark:bg-slate-950">
				<GradientHeader title="Help & FAQ" subtitle="Answers to common questions" icon="frequently-asked-questions" />
				<S.ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: insets.bottom + 30 }} keyboardShouldPersistTaps="handled">
					<S.View className="flex-row items-center h-14 px-4 rounded-full bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700">
						<MaterialCommunityIcons name="magnify" size={22} color={accent} />
						<S.TextInput
							value={query}
							onChangeText={setQuery}
							placeholder="Search questions..."
							placeholderTextColor={muted}
							autoCorrect={false}
							className="flex-1 ml-3 h-full text-base font-pregular text-slate-800 dark:text-slate-100"
							accessibilityLabel="Search questions"
						/>
						{!!query && (
							<S.TouchableOpacity onPress={() => setQuery('')} className="p-1" accessibilityRole="button" accessibilityLabel="Clear search">
								<MaterialCommunityIcons name="close-circle" size={20} color={muted} />
							</S.TouchableOpacity>
						)}
					</S.View>

					{sections.length === 0 && (
						<S.Text className="text-center text-base font-pregular text-slate-500 dark:text-slate-400 mt-10">No questions match “{query}”.</S.Text>
					)}

					{sections.map((section) => (
						<S.View key={section.section}>
							<S.Text className="mt-6 mb-2 ml-1 text-sm uppercase tracking-wider font-pbold text-blue-700 dark:text-blue-300" accessibilityRole="header">
								{section.section}
							</S.Text>
							{section.items.map((item) => {
								const expanded = open === item.q || !!query.trim()
								return (
									<FadeInItem key={item.q} index={index++}>
										<Animated.View layout={LinearTransition.duration(220).reduceMotion(ReduceMotion.System)}>
											<S.TouchableOpacity
												onPress={() => setOpen(open === item.q ? null : item.q)}
												activeOpacity={0.85}
												className={`mb-3 rounded-2xl bg-white dark:bg-slate-900 border p-4 ${expanded ? 'border-blue-200 dark:border-blue-900' : 'border-slate-100 dark:border-slate-800'}`}
												style={{ shadowColor: '#1e3a8a', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 }}
												accessibilityRole="button"
												accessibilityState={{ expanded }}
												accessibilityLabel={item.q}
											>
												<S.View className="flex-row items-center">
													<S.Text className="flex-1 text-base font-psemibold text-blue-950 dark:text-slate-100">{item.q}</S.Text>
													<MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={24} color={accent} />
												</S.View>
												{expanded && (
													<Animated.View entering={FadeIn.duration(250).reduceMotion(ReduceMotion.System)}>
														<S.Text className="mt-2 text-sm font-pregular leading-5 text-slate-600 dark:text-slate-300">{item.a}</S.Text>
													</Animated.View>
												)}
											</S.TouchableOpacity>
										</Animated.View>
									</FadeInItem>
								)
							})}
						</S.View>
					))}
				</S.ScrollView>
			</S.View>
		</RequireAuth>
	)
}
