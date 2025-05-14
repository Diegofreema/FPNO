import { NavHeader } from '@/components/ui/nav-header';
import { Wrapper } from '@/components/ui/wrapper';
import { CreateChatRoom } from '@/features/chat-room/components/create-chat-room';
import React from 'react';

const CreateChatRoomScreen = () => {
  return (
    <Wrapper>
      <NavHeader title="Create chat room" />
      <CreateChatRoom />
    </Wrapper>
  );
};

export default CreateChatRoomScreen;
