import {
  BUCKET_ID,
  CHAT_COLLECTION_ID,
  DATABASE_ID,
  PROJECT_ID,
} from '@/config';
import { databases, storage } from '@/db/appwrite';
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
      [Query.equal('name', name)]
    );
    if (chatRoomInDb.documents.length > 0) {
      throw new Error('Chat room already exists');
    }
    const chatRoom = await databases.createDocument(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      ID.unique(),
      {
        channel_name: name,
        description,
        image: id,
        creator_id: creatorId,
        image_url: link,
        image_id: id,
        members: [creatorId],
        admin_ids: [creatorId],
      }
    );
    return chatRoom;
  } catch (error) {
    console.log(error);

    throw new Error('Failed to create chat room');
  }
};
