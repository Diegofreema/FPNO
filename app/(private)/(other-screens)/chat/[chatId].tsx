import { ErrorComponent } from '@/components/ui/error-component';
import { Loading } from '@/components/ui/loading';
import { Wrapper } from '@/components/ui/wrapper';
import {
  useGetMember,
  useGetPendingMember,
} from '@/features/chat-room/api/use-get-member';
import { useGetConversationWithMessages } from '@/features/chat/api/use-get-conversation';
import { ChatNav } from '@/features/chat/components/chat-nav';
import { formatNumber } from '@/helper';
import { useIsCreator } from '@/hooks/useIsCreator';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

const ChatId = () => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [more] = useState(0);

  const { data, isPending, isError, error, refetch } =
    useGetConversationWithMessages({ roomId: chatId, offSet: more });
  const {
    data: member,
    isPending: isPendingMember,
    isError: isErrorMember,
    error: errorMember,
  } = useGetMember({ channel_id: chatId });
  const {
    data: pendingMember,
    isPending: isPendingPendingMember,
    isError: isErrorPendingMember,
    error: errorPendingMember,
  } = useGetPendingMember({ channel_id: chatId });
  const isCreator = useIsCreator({ creatorId: data?.creator_id });
  const errorMessage =
    error?.message || errorMember?.message || errorPendingMember?.message;
  if (isError || isErrorMember || isErrorPendingMember) {
    return <ErrorComponent onPress={refetch} title={errorMessage} />;
  }

  if (isPending || isPendingMember || isPendingPendingMember) {
    return <Loading />;
  }

  const followersText = `${formatNumber(data?.members_count)} ${
    data?.members_count > 1 ? 'members' : 'member'
  }`;

  return (
    <Wrapper>
      <ChatNav
        name={data.channel_name}
        subText={followersText}
        imageUrl={data.image_url}
        channelId={chatId}
        isCreator={isCreator}
        isMember={!!member.total}
        isInPending={!!pendingMember.total}
      />
    </Wrapper>
  );
};

export default ChatId;
