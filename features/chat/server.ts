import { CHAT_COLLECTION_ID, DATABASE_ID, USER_COLLECTION_ID } from '@/config';
import { databases } from '@/db/appwrite';
import { deleteMessageHelpFn, generateErrorMessage } from '@/helper';
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

export const deleteMessages = async (
  messageIds: string[],
  loggedInUser: string
) => {
  try {
    const messagesToDelete = messageIds.map(async (messageId) => {
      await deleteMessageHelpFn(messageId, loggedInUser);
    });
    await Promise.all(messagesToDelete);
  } catch (e) {
    throw new Error(generateErrorMessage(e, 'Failed to delete messages'));
  }
};
