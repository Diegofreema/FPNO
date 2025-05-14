import { ErrorComponent } from '@/components/ui/error-component';
import { Loading } from '@/components/ui/loading';
import { useGetTopChatRooms } from '@/features/chat-room/api/use-get-top-chat-rooms';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { ChatHeader } from './chat-header';
import { SearchInput } from './search-converstion';
import { TopChannels } from './top-channels';

export const Chat = () => {
  const [value, setValue] = useState('');
  const { data, isPending, isError, refetch, error } = useGetTopChatRooms();
  console.log(error);

  if (isError) {
    return <ErrorComponent onPress={refetch} />;
  }

  if (isPending) {
    return <Loading />;
  }

  console.log(data);

  return (
    <View style={{ gap: 10 }}>
      <ChatHeader />
      <SearchInput
        placeholder="Search conversations"
        value={value}
        onChangeText={setValue}
      />
      <TopChannels channels={data.documents} />
      <Text>chat</Text>
    </View>
  );
};
