import React from 'react';
import { Text, View } from 'react-native';
import { ChatHeader } from './chat-header';
import { SearchConversation } from './search-converstion';

export const Chat = () => {
  return (
    <View>
      <ChatHeader />
      <SearchConversation />
      <Text>chat</Text>
    </View>
  );
};
