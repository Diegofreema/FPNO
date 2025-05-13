import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { ChatHeader } from './chat-header';
import { SearchInput } from './search-converstion';

export const Chat = () => {
  const [value, setValue] = useState('');

  return (
    <View style={{ gap: 10 }}>
      <ChatHeader />
      <SearchInput
        placeholder="Search conversations"
        value={value}
        onChangeText={setValue}
      />
      <Text>chat</Text>
    </View>
  );
};
