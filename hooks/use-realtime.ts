import {
  CHAT_COLLECTION_ID,
  CHAT_MESSAGES_COLLECTION_ID,
  DATABASE_ID,
  MEMBER_ID,
} from '@/config';
import { client } from '@/db/appwrite';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const keys = [
  'pending_member',
  'members',
  'channel',
  'channels-i-am-in',
  'member',
  'room-info',
  'explore-rooms',
  'messages',
  'top-chat-rooms',
];
export const useRealtime = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const roomChannel = `databases.${DATABASE_ID}.collections.${CHAT_COLLECTION_ID}.documents`;
    const memberChannel = `databases.${DATABASE_ID}.collections.${MEMBER_ID}.documents`;
    const messageChannel = `databases.${DATABASE_ID}.collections.${CHAT_MESSAGES_COLLECTION_ID}.documents`;
    const unsubscribe = client.subscribe(
      [roomChannel, messageChannel, memberChannel],
      (response) => {
        console.log(response, 'pending');
        keys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
};
