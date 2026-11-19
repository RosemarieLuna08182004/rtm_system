import React from 'react';
import { TabIcon } from "@/components";
import { AvatarIcon, BookmarkIcon, HomeIcon } from "@/constants";
import { colors } from "@/styles";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CountryPrompt } from '@/components/Modals/CountryPrompt';

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    
    return (
        <>
            <Tabs 
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.palette.neutral['400'],
                    tabBarStyle: {
                        backgroundColor: colors.white,
                        borderTopWidth: 1,
                        borderTopColor: colors.palette.neutral['100'],
                        height: 80 + insets.bottom,
                        paddingTop: 20,  // Increased from 16 to 20
                        paddingBottom: Math.max(insets.bottom, 5),
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerShown: false,
                }}>
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon 
                                Icon={HomeIcon} 
                                Color={color} 
                                Name="Home" 
                                Focused={focused} 
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="bookmark"
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon 
                                Icon={BookmarkIcon} 
                                Color={color} 
                                Name="Bookmarks" 
                                Focused={focused} 
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon 
                                Icon={AvatarIcon} 
                                Color={color} 
                                Name="Profile" 
                                Focused={focused} 
                            />
                        ),
                    }}
                />
            </Tabs>
            {/* Asks once for a country if the account has none (Google sign-in, older accounts) */}
            <CountryPrompt />
            <StatusBar style="auto" />
        </>
    );
};
