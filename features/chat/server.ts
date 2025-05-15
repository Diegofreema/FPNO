import { CHAT_COLLECTION_ID, DATABASE_ID, USER_COLLECTION_ID } from '@/config';
import { databases } from '@/db/appwrite';
import { generateErrorMessage } from '@/helper';
import { ChannelType, UserType } from '@/types';
import { Query } from 'react-native-appwrite';

export const fetchOtherUsers = async ({
  userId,
  query,
  offSet,
}: {
  userId: string;
  query?: string;
  offSet: number;
}) => {
  const fetchQuery = [
    Query.notEqual('userId', userId),
    Query.limit(50 + offSet),
  ];

  if (query) {
    fetchQuery.push(Query.search('name', query));
  }

  const users = await databases.listDocuments<UserType>(
    DATABASE_ID,
    USER_COLLECTION_ID,
    fetchQuery
  );

  return users;
};

export const getConversationWithMessages = async ({
  roomId,
}: {
  roomId: string;
}) => {
  try {
    const conversation = await databases.getDocument<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      roomId
    );

    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return conversation;
  } catch (error) {
    throw new Error(generateErrorMessage(error, 'Failed to get chat room'));
  }
};

export const getMembers = async ({ channel_id }: { channel_id: string }) => {
  try {
  } catch (error) {}
};
