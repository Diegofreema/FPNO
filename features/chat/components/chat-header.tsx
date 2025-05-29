import { Title } from '@/components/typography/title';
import { CustomPressable } from '@/components/ui/custom-pressable';
import { colors } from '@/constants';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export const ChatHeader = () => {
  const router = useRouter();
  const onPress = () => {
    console.log('pressed');

    router.push('/create-chat-room');
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
      }}
    >
      <Title text="Chat Rooms" textStyle={{ color: colors.black }} />
      <CustomPressable onPress={onPress}>
        <Feather name="plus" color={colors.lightblue} size={25} />
      </CustomPressable>
    </View>
  );
};
