import { NavHeader } from '@/components/ui/nav-header';
import { Wrapper } from '@/components/ui/wrapper';
import { ChatMenu } from '@/features/chat/components/chat-menu';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

const RoomInfo = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const router = useRouter();
  const onSelect = () => {
    router.push(`/chat/edit?${roomId}`);
  };
  return (
    <Wrapper>
      <NavHeader
        title=""
        leftContent={() => (
          <ChatMenu menuItems={[{ onSelect: onSelect, text: 'Edit' }]} />
        )}
      />
    </Wrapper>
  );
};

export default RoomInfo;
