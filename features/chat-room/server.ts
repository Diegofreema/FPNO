import {
  BUCKET_ID,
  CHAT_COLLECTION_ID,
  DATABASE_ID,
  MEMBER_ID,
  PENDING_ID,
  PROJECT_ID,
} from '@/config';
import { databases, storage } from '@/db/appwrite';
import { generateErrorMessage } from '@/helper';
import {
  ChannelType,
  MemberAccessRole,
  MemberStatus,
  MemberType,
} from '@/types';
import { ID, Query } from 'react-native-appwrite';
import { CreateChatRoomSchema, JoinModelType, JoinType } from './schema';

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
        last_message_time: Date.now(),
        description,
        image_url: link,
        image_id: id,
        last_message: `The chat room "${name}" was created`,
      }
    );

    await databases.createDocument<MemberType>(
      DATABASE_ID,
      MEMBER_ID,
      ID.unique(),
      {
        channel_id: chatRoom.$id,
        member_id: creatorId,
        accessRole: MemberAccessRole.ADMIN,
        status: MemberStatus.ACCEPTED,
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
    const channelsThatIAmIn = await databases.listDocuments<MemberType>(
      DATABASE_ID,
      MEMBER_ID,
      [Query.equal('member_id', userId)]
    );

    const channelIds = channelsThatIAmIn.documents.map(
      (item) => item.channel_id
    );

    const query = [Query.limit(25 + more)];

    if (channelIds.length > 0) {
      query.push(Query.equal('$id', channelIds));
    }
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
  userId,
  more,
  search,
}: {
  userId: string;
  more: number;
  search?: string;
}) => {
  try {
    const query = [
      Query.limit(25 + more),
      Query.orderDesc('members_count'),
      Query.notEqual('creator_id', userId),
    ];

    if (search) {
      query.push(Query.search('channel_name', search));
    }

    const rooms = await databases.listDocuments<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      query
    );

    // Fetch pending members for each room
    const pendingMembersToFetch = rooms.documents.map(async (room) => {
      const pendingMembersResponse = await databases.listDocuments<MemberType>(
        DATABASE_ID,
        MEMBER_ID,
        [Query.equal('channel_id', room.$id), Query.equal('status', 'PENDING')]
      );

      return {
        ...room,
        pendingMembers: pendingMembersResponse.documents,
      };
    });

    const roomsWithPendingMembers = await Promise.all(pendingMembersToFetch);

    // Filter out rooms where creatorId is in members
    const finalRooms = roomsWithPendingMembers.filter((room) => {
      return !room.pendingMembers.some((member) => member.member_id === userId);
    });

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

export const joinRoom = async ({
  channel_id,
  member_to_join,
}: JoinType): Promise<JoinModelType> => {
  try {
    const isAlreadyInPendingList = await databases.listDocuments(
      DATABASE_ID,
      PENDING_ID,
      [
        Query.equal('channel_id', channel_id),
        Query.equal('member_to_join', member_to_join),
      ]
    );
    if (isAlreadyInPendingList.documents.length > 0) {
      throw new Error('You have already sent a request to join this room');
    }

    const pending = await databases.createDocument<JoinModelType>(
      DATABASE_ID,
      PENDING_ID,
      ID.unique(),
      {
        channel_id,
        member_to_join,
      }
    );

    return pending;
  } catch (error) {
    throw new Error(generateErrorMessage(error, 'Failed to send request'));
  }
};

export const getMembers = async ({
  channel_id,
  status,
  more,
}: {
  channel_id: string;
  status: MemberStatus;
  more: number;
}) => {
  try {
    const channel = await databases.getDocument<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      channel_id
    );
    if (!channel) {
      throw new Error('Channel not found');
    }
    const members = await databases.listDocuments<MemberType>(
      DATABASE_ID,
      MEMBER_ID,
      [
        Query.equal('channel_id', channel_id),
        Query.equal('status', status),
        Query.limit(25 + more),
      ]
    );
    return members;
  } catch (error) {
    throw new Error(generateErrorMessage(error, 'Failed to get members'));
  }
};

export const getMember = async ({
  member_id,
  channel_id,
}: {
  member_id: string;
  channel_id: string;
}) => {
  try {
    const channel = await databases.getDocument<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      channel_id
    );
    if (!channel) {
      throw new Error('Channel not found');
    }
    const member = await databases.listDocuments<MemberType>(
      DATABASE_ID,
      MEMBER_ID,
      [
        Query.equal('channel_id', channel_id),
        Query.equal('member_id', member_id),
        Query.equal('status', MemberStatus.ACCEPTED),
      ]
    );

    return member;
  } catch (error) {
    throw new Error(generateErrorMessage(error, 'Failed to get member'));
  }
};
