import { Tabs } from 'expo-router';
import React from 'react';

import { TabIcons } from '@/components/TabIcons';

import { colors } from '@/constants';
import { useAuth } from '@/lib/zustand/useAuth';
import {
  IconCashBanknote,
  IconDotsCircleHorizontal,
  IconHome2,
  IconIdBadge,
  IconMessage,
  IconSchool,
} from '@tabler/icons-react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {AntDesign} from "@expo/vector-icons";

export default function TabLayout() {
  const id = useAuth((state) => state.user.id);

  console.log(id);

  return (
    <>
      <StatusBar backgroundColor="white" style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.lightblue,
            headerShown: false,
            tabBarButton: HapticTab,

            tabBarLabelStyle: {
              fontFamily: 'NunitoBold',
              fontSize: RFPercentage(1.2),
            },
            tabBarStyle: { backgroundColor: 'white', paddingTop: 10 },
            tabBarLabelPosition: 'below-icon',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ size, focused }) => (
                <AntDesign
                    name={'home'}
                  id="in"
                  size={size}
                  // focused={focused}

                />
              ),
            }}
          />
          <Tabs.Screen
            name="academics"
            options={{
              title: 'Academics',
              href: null,
              tabBarIcon: ({ size, focused }) => (
                <TabIcons
                  id="aca"
                  size={size}
                  focused={focused}
                  icon={IconSchool}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="payment"
            options={{
              title: 'Payments',
              href: null,
              tabBarIcon: ({ size, focused }) => (
                <TabIcons
                  id="payment"
                  size={size}
                  focused={focused}
                  icon={IconCashBanknote}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: 'chats',
              href: null,
              tabBarIcon: ({ size, focused }) => (
                <View>
                  <TabIcons
                    id="chat"
                    size={size}
                    focused={focused}
                    icon={IconMessage}
                  />
                </View>
              ),
            }}
          />

          <Tabs.Screen
            name="id"
            options={{
              title: 'ID',
              tabBarIcon: ({ size, focused }) => (
                <TabIcons
                  size={size}
                  focused={focused}
                  icon={IconIdBadge}
                  id="more"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="more"
            options={{
              title: 'More',
              tabBarIcon: ({ size, focused }) => (
                <TabIcons
                  size={size}
                  focused={focused}
                  icon={IconDotsCircleHorizontal}
                  id="more"
                />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </>
  );
}
