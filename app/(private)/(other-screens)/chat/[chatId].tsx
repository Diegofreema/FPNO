import { Wrapper } from '@/components/ui/wrapper';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

const ChatId = () => {
  const { chatId } = useLocalSearchParams();
  return (
    <Wrapper>
      <Text>{chatId}</Text>
    </Wrapper>
  );
};

export default ChatId;
