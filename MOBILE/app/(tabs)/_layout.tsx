import React from 'react';
import { TabIcon } from "@/components";
import { AvatarIcon, BookmarkIcon, HomeIcon, OpenBookIcon } from "@/constants";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreferences, useThemeColors } from '@/context';

const TABS = [
    { name: 'home', label: 'Home', icon: HomeIcon },
    { name: 'volumes', label: 'Volumes', icon: OpenBookIcon },
    { name: 'bookmark', label: 'Bookmarks', icon: BookmarkIcon },
    { name: 'profile', label: 'Profile', icon: AvatarIcon },
];

import { AppErrorBoundary } from '@/components/States/AppErrorBoundary';
// A screen that crashes shows a friendly 'Try again' page instead of closing the app.
export { AppErrorBoundary as ErrorBoundary }

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    const { isDark, displayScale } = usePreferences();
    const theme = useThemeColors();
    // The bar grows with the display size (capped so it never takes over the screen).
    const barHeight = Math.round(70 * Math.min(displayScale, 1.5));

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: theme.primary,
                    tabBarInactiveTintColor: isDark ? '#64748b' : '#9ca3af',
                    tabBarStyle: {
                        backgroundColor: theme.surface,
                        borderTopWidth: 1,
                        borderTopColor: theme.border,
                        height: barHeight + insets.bottom,
                        paddingTop: 12,
                        paddingBottom: Math.max(insets.bottom, 5),
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerShown: false,
                    // No tab-switch animation: on Android it could leave a newly opened tab blank.
                    // Each tab's cards still fade in when it opens.
                }}>
                {TABS.map((tab) => (
                    <Tabs.Screen
                        key={tab.name}
                        name={tab.name}
                        options={{
                            tabBarAccessibilityLabel: tab.label,
                            tabBarIcon: ({ color, focused }) => (
                                <TabIcon Icon={tab.icon} Color={color} Name={tab.label} Focused={focused} />
                            ),
                        }}
                    />
                ))}
            </Tabs>
            {/* Every tab has a blue header, so light status-bar icons in both themes. */}
            <StatusBar style="light" />
        </>
    );
};
