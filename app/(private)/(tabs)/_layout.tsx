import {Href, Tabs} from 'expo-router';
import React from 'react';

import {colors} from '@/constants';
import {useAuth} from '@/lib/zustand/useAuth';
import {SafeAreaView} from 'react-native-safe-area-context';

import {HapticTab} from '@/components/HapticTab';
import {ErrorComponent} from '@/components/ui/error-component';
import {Loading} from '@/components/ui/loading';
import {useGetUserByUserId} from '@/features/auth/api/use-get-user-by-user-id';
import {AntDesign} from '@expo/vector-icons';
import {RFPercentage} from 'react-native-responsive-fontsize';

export default function TabLayout() {
  const variant = useAuth((state) => state.user?.variant);
  const { isPending, isError, refetch } = useGetUserByUserId();

  if (isError) {
    return <ErrorComponent onPress={refetch} />;
  }
  if (isPending) {
    return <Loading />;
  }
  const tabs: {
    name: string;
    title: string;
    icon: string;
    href: Href | null;
  }[] =
    variant === 'STUDENT'
      ? [
          {
            name: 'index',
            title: 'Home',
            icon: 'home',
            href: '/(private)/(tabs)',
          },
          {
            name: 'academics',
            title: 'Academics',
            icon: 'book',
            href: null,
          },
          {
            name: 'payment',
            title: 'Payments',
            icon: 'pay-circle1',
            href: null,
          },
          { name: 'chat', title: 'Chats', icon: 'wechat', href: '/chat' },
          { name: 'id', title: 'ID', icon: 'idcard', href: '/id' },
          { name: 'more', title: 'More', icon: 'ellipsis1', href: '/more' },
        ]
      : [
          { name: 'index', title: 'Home', icon: 'home', href: null },
          { name: 'academics', title: 'Academics', icon: 'book', href: null },
          {
            name: 'payment',
            title: 'Payments',
            icon: 'pay-circle1',
            href: null,
          },
          { name: 'chat', title: 'Chats', icon: 'wechat', href: '/chat' },
          { name: 'id', title: 'ID', icon: 'idcard', href: null },
          { name: 'more', title: 'More', icon: 'ellipsis1', href: '/more' },
        ];

  return (
    <>
      {/* <StatusBar backgroundColor="white" style="dark" /> */}
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
            tabBarStyle: { backgroundColor: 'white',  },
            tabBarLabelPosition: 'below-icon',
          }}
        >
          {tabs.map((tab) => (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                title: tab.title,
                href: tab.href,
                tabBarIcon: ({ size, focused }) => (
                  <AntDesign
                    // @ts-ignore
                    name={tab.icon}
                    id="in"
                    size={20}
                    color={focused ? colors.lightblue : colors.gray}
                  />
                ),
              }}
            />
          ))}
        </Tabs>
      </SafeAreaView>
    </>
  );
}
