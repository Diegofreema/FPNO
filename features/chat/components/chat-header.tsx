import { Title } from '@/components/typography/title';
import { HStack } from '@/components/ui/h-stack';
import { colors } from '@/constants';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export const ChatHeader = () => {
  const router = useRouter();
  const onPress = () => {
    router.push('/create-chat-room');
  };
  return (
    <HStack
      leftContent={() => (
        <Title text="Chat Rooms" textStyle={{ color: colors.black }} />
      )}
      rightContent={() => (
        <TouchableOpacity activeOpacity={0.7} hitSlop={10} onPress={onPress}>
          <Feather name="plus" color={colors.lightblue} size={25} />
        </TouchableOpacity>
      )}
    />
  );
};
