import { CHAT_COLLECTION_ID, DATABASE_ID } from '@/config';
import { client } from '@/db/appwrite';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useGetMessages } from '../api/use-get-messages';

type Props = {
  channel_id: string;
  more: number;
  loggedInUser: string;
};

export const useMessages = ({ channel_id, more, loggedInUser }: Props) => {
  const queryClient = useQueryClient();
  const {
    data,
    isPending,
    isError,
    refetch,
    error,
    isRefetchError,
    isRefetching,
  } = useGetMessages({ channel_id, more });
  useEffect(() => {
    const channel = `databases.${DATABASE_ID}.collections.${CHAT_COLLECTION_ID}.documents.${channel_id}`;

    const unsubscribe = client.subscribe(channel, (response) => {
      console.log(response);
      refetch();
    });

    return () => {
      unsubscribe();
    };
  }, [channel_id, queryClient, more, refetch]);
  const messageData = data?.documents.map((message) => ({
    _id: message?.$id,
    text: message?.message,
    createdAt: new Date(message?.$createdAt),
    user: {
      _id: message?.user.userId!,
      name: message.sender_id === loggedInUser ? 'You' : message?.user?.name,
    },
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
