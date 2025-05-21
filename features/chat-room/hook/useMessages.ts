import { ReplyType } from '@/types';
import { useGetMessages } from '../api/use-get-messages';

type Props = {
  channel_id: string;
  more: number;
  loggedInUser: string;
};

export const useMessages = ({ channel_id, more, loggedInUser }: Props) => {
  const {
    data,
    isPending,
    isError,
    refetch,
    error,
    isRefetchError,
    isRefetching,
  } = useGetMessages({ channel_id, more });

  const messageData = data?.documents.map((message) => ({
    _id: message?.$id,
    text: message?.message,
    createdAt: new Date(message?.$createdAt),
    user: {
      _id: message?.user.userId!,
      name: message.sender_id === loggedInUser ? 'You' : message?.user?.name,
    },
    reactions: message.reactions,
    fileType: message.fileType,
    fileUrl: message.fileUrl,
    reply: message.reply as ReplyType,
  }));
  return {
    data: {
      total: data?.total,
      messages: messageData,
    },
    isPending,
    isError,
    refetch,
    error,
    isRefetchError,
    isRefetching,
  };
};
