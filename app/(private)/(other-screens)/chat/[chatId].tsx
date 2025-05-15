import { ErrorComponent } from '@/components/ui/error-component';
import { Loading } from '@/components/ui/loading';
import { Wrapper } from '@/components/ui/wrapper';
import { useGetConversationWithMessages } from '@/features/chat/api/use-get-conversation';
import { ChatNav } from '@/features/chat/components/chat-nav';
import { checkIfIsMember, formatNumber } from '@/helper';
import { useIsCreator } from '@/hooks/useIsCreator';
import { useAuth } from '@/lib/zustand/useAuth';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

const ChatId = () => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [more] = useState(0);
  const id = useAuth((state) => state.user?.id!);
  const { data, isPending, isError, error, refetch } =
    useGetConversationWithMessages({ roomId: chatId, offSet: more });
  const isCreator = useIsCreator({ creatorId: data?.creator_id });

  if (isError) {
    return <ErrorComponent onPress={refetch} title={error.message} />;
  }

  if (isPending) {
    return <Loading />;
  }

  const followersText = `${formatNumber(data?.members_count)} members`;
  const isMember = checkIfIsMember(data.members, id);
  return (
    <Wrapper>
      <ChatNav
        name={data.channel_name}
        subText={followersText}
        imageUrl={data.image_url}
        channelId={chatId}
        isCreator={isCreator}
        isMember={isMember}
      />
    </Wrapper>
  );
};

export default ChatId;
