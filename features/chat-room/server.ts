import {
  BUCKET_ID,
  CHAT_COLLECTION_ID,
  DATABASE_ID,
  PROJECT_ID,
} from '@/config';
import { databases, storage } from '@/db/appwrite';
import { ChannelType } from '@/types';
import { ID, Query } from 'react-native-appwrite';
import { CreateChatRoomSchema } from './schema';

export const createChatRoom = async ({
  name,
  description,
  image,
  creatorId,
}: CreateChatRoomSchema & { creatorId: string }) => {
  try {
    let id;
    let link;
    if (image) {
      const file = await storage.createFile(BUCKET_ID, ID.unique(), image);
      id = file.$id;
      link = `https://fra.cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}&mode=admin`;
    }

    console.log(id, link);

    const chatRoomInDb = await databases.listDocuments(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      [Query.equal('channel_name', name)]
    );
    if (chatRoomInDb.documents.length > 0) {
      throw new Error('Chat room with name already exists');
    }
    const chatRoom = await databases.createDocument<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      ID.unique(),
      {
        channel_name: name,
        creator_id: creatorId,
        members: [creatorId],
        admin_ids: [creatorId],
        description,
        image_url: link,
        image_id: id,
        last_message: `The chat room "${name}" was created`,
      }
    );
    return chatRoom;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create chat room';

    throw new Error(errorMessage);
  }
};

export const getTopChatRooms = async () => {
  try {
    const chatRooms = await databases.listDocuments<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      [Query.limit(5), Query.orderDesc('members_count')]
    );

    return chatRooms;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to get top chat rooms';
    throw new Error(errorMessage);
  }
};

export const getChannelsIamIn = async ({
  userId,
  search,
  more,
}: {
  userId: string;
  search?: string;
  more: number;
}) => {
  try {
    const query = [Query.limit(25 + more), Query.contains('members', userId)];

    if (search) {
      query.push(Query.search('channel_name', search));
    }

    const chatRooms = await databases.listDocuments<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      query
    );
    return chatRooms;
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to load chat rooms';

    throw new Error(errorMessage);
  }
};

export const exploreRooms = async ({
  creatorId,
  more,
  search,
}: {
  creatorId: string;
  more: number;
  search?: string;
}) => {
  try {
    const query = [
      Query.limit(25 + more),
      Query.notEqual('creator_id', creatorId),
    ];

    if (search) {
      query.push(Query.search('channel_name', search));
    }

    const rooms = await databases.listDocuments<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      query
    );

    const finalRooms = rooms.documents.filter(
      (r) => !r.members.includes(creatorId)
    );
    return {
      ...rooms,
      documents: finalRooms,
    };
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to load chat rooms';

    throw new Error(errorMessage);
  }
};
