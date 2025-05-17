import {
  BUCKET_ID,
  CHAT_COLLECTION_ID,
  DATABASE_ID,
  MEMBER_ID,
  PROJECT_ID,
  USER_COLLECTION_ID,
} from '@/config';
import { databases, storage } from '@/db/appwrite';
import { generateErrorMessage } from '@/helper';
import {
  ChannelType,
  MemberAccessRole,
  MemberStatus,
  MemberType,
  UserType,
} from '@/types';
import { ID, Query } from 'react-native-appwrite';
import { CreateChatRoomSchema, JoinType } from './schema';

export const createChatRoom = async ({
  name,
  description,
  image,
  creatorId,
}: CreateChatRoomSchema & { creatorId: string }) => {
  try {
    let id;
    let link;
    if (typeof image !== 'string' && image) {
      const file = await storage.createFile(BUCKET_ID, ID.unique(), image);
      id = file.$id;
      link = `https://fra.cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}&mode=admin`;
    }

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
        channel_name: name.trim(),
        creator_id: creatorId,
        last_message_time: new Date().toISOString(),
        description: description?.trim(),
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
        access_role: MemberAccessRole.ADMIN,
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

export const editChatRoom = async ({
  name,
  description,
  image,
  creatorId,
  channel_id,
}: CreateChatRoomSchema & { creatorId: string; channel_id: string }) => {
  try {
    const channelExists = await databases.getDocument<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      channel_id
    );

    if (!channelExists) {
      throw new Error('Chat room not found');
    }

    if (channelExists.creator_id !== creatorId) {
      throw new Error('You are not the creator of this chat room');
    }

    let id;
    let link;
    if (typeof image !== 'string' && image) {
      const file = await storage.createFile(BUCKET_ID, ID.unique(), image);
      id = file.$id;
      link = `https://fra.cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}&mode=admin`;
    } else {
      link = image;
    }

    const chatRoom = await databases.updateDocument<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      channel_id,
      {
        channel_name: name.trim(),
        description: description?.trim(),
        image_url: link,
        image_id: id || channelExists.image_id,
      }
    );

    return chatRoom;
  } catch (error: unknown) {
    throw new Error(generateErrorMessage(error, 'Failed to update chat room'));
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
const BASE_LIMIT = 25;
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
      [
        Query.equal('member_id', userId),
        Query.equal('status', MemberStatus.ACCEPTED),
      ]
    );

    const channelIds = channelsThatIAmIn.documents.map(
      (item) => item.channel_id
    );

    // If no channels, return empty result
    if (channelIds.length === 0) {
      return { documents: [], total: 0 };
    }

    // Build query
    const query = [Query.equal('$id', channelIds)];

    // Add search if provided and valid
    if (search && search.trim()) {
      query.push(Query.search('channel_name', search.trim()));
    }

    // Add limit last for better performance
    query.push(Query.limit(BASE_LIMIT + more));

    // Fetch channels
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
      return !room.pendingMembers.some(
        (member) =>
          member.member_id === userId && member.status === MemberStatus.ACCEPTED
      );
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
}: JoinType): Promise<MemberType> => {
  try {
    const isAlreadyInPendingList = await databases.listDocuments(
      DATABASE_ID,
      MEMBER_ID,
      [
        Query.equal('channel_id', channel_id),
        Query.equal('member_id', member_to_join),
        Query.equal('status', MemberStatus.PENDING),
      ]
    );
    if (isAlreadyInPendingList.documents.length > 0) {
      throw new Error('You have already sent a request to join this room');
    }

    const pending = await databases.createDocument<MemberType>(
      DATABASE_ID,
      MEMBER_ID,
      ID.unique(),
      {
        channel_id,
        member_id: member_to_join,
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
    const membersList = members.documents.map(async (member) => {
      const res = await databases.listDocuments<UserType>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        [Query.equal('userId', member.member_id)]
      );
      return {
        ...member,
        user: res.documents[0],
      };
    });

    const membersWithUserProfile = await Promise.all(membersList);
    return {
      ...members,
      documents: membersWithUserProfile,
    };
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
export const getPendingMember = async ({
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
        Query.equal('status', MemberStatus.PENDING),
      ]
    );

    return member;
  } catch (error) {
    throw new Error(generateErrorMessage(error, 'Failed to get member'));
  }
};

export const getRoomInfo = async ({ roomId }: { roomId: string }) => {
  try {
    const room = await databases.getDocument<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      roomId
    );

    return room;
  } catch (error) {
    throw new Error(generateErrorMessage(error, 'Failed to get room info'));
  }
};

export const acceptRequest = async ({
  memberId,
  roomId,
}: {
  roomId: string;
  memberId: string;
}) => {
  try {
    const roomExists = await databases.getDocument<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      roomId
    );
    if (!roomExists) {
      throw new Error('Chat room does not exist');
    }

    const pendingMember = await databases.listDocuments<MemberType>(
      DATABASE_ID,
      MEMBER_ID,
      [Query.equal('channel_id', roomId), Query.equal('member_id', memberId)]
    );
    if (pendingMember.total === 0) {
      throw new Error('Pending member does not exist');
    }

    await databases.updateDocument(
      DATABASE_ID,
      MEMBER_ID,
      pendingMember.documents[0].$id,
      {
        status: MemberStatus.ACCEPTED,
      }
    );

    await databases.updateDocument(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      roomExists.$id,
      {
        members_count: roomExists.members_count + 1,
      }
    );
  } catch (error) {
    throw new Error(generateErrorMessage(error, 'Failed to accept request'));
  }
};

export const declineRequest = async ({
  memberId,
  roomId,
}: {
  roomId: string;
  memberId: string;
}) => {
  try {
    const roomExists = await databases.getDocument(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      roomId
    );
    if (!roomExists) {
      throw new Error('Chat room does not exist');
    }

    const pendingMember = await databases.listDocuments<MemberType>(
      DATABASE_ID,
      MEMBER_ID,
      [Query.equal('channel_id', roomId), Query.equal('member_id', memberId)]
    );
    if (pendingMember.total === 0) {
      throw new Error('Pending member does not exist');
    }

    await databases.deleteDocument(
      DATABASE_ID,
      MEMBER_ID,
      pendingMember.documents[0].$id
    );
  } catch (error) {
    throw new Error(generateErrorMessage(error, 'Failed to delete request'));
  }
};

export const removeMember = async ({
  roomId,
  memberId,
  actionUserId,
}: {
  roomId: string;
  memberId: string;
  actionUserId: string;
}) => {
  try {
    const chatRoom = await databases.getDocument<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      roomId
    );

    if (!chatRoom) {
      throw new Error('Chat room does not exist');
    }
    const member = await databases.listDocuments<MemberType>(
      DATABASE_ID,
      MEMBER_ID,
      [
        Query.equal('channel_id', roomId),
        Query.equal('member_id', actionUserId),
      ]
    );
    if (member.total === 0) {
      throw new Error('You are not authorized to perform this action');
    }
    if (
      chatRoom.creator_id !== actionUserId &&
      member.documents[0].access_role !== MemberAccessRole.ADMIN
    ) {
      throw new Error('You are not authorized to perform this action');
    }

    const isAMember = await databases.listDocuments<MemberType>(
      DATABASE_ID,
      MEMBER_ID,
      [Query.equal('channel_id', roomId), Query.equal('member_id', memberId)]
    );
    if (isAMember.total === 0) {
      throw new Error('Member does not exist');
    }
    await databases.deleteDocument(DATABASE_ID, MEMBER_ID, memberId);
  } catch (error) {
    throw new Error(generateErrorMessage(error, 'Failed to delete request'));
  }
};

export const leaveRoom = async ({
  roomId,
  memberId,
}: {
  roomId: string;
  memberId: string;
}) => {
  try {
    const chatRoom = await databases.getDocument<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      roomId
    );
    if (!chatRoom) {
      throw new Error('Chat room does not exist');
    }
    const member = await databases.listDocuments<MemberType>(
      DATABASE_ID,
      MEMBER_ID,
      [Query.equal('channel_id', roomId), Query.equal('member_id', memberId)]
    );
    if (member.total === 0) {
      throw new Error('Member does not exist');
    }
    await databases.deleteDocument(DATABASE_ID, MEMBER_ID, memberId);
  } catch (error) {
    throw new Error(generateErrorMessage(error, 'Failed to leave room'));
  }
};

export const updateMemberRole = async ({
  roomId,
  memberId,
  actionUserId,
}: {
  roomId: string;
  memberId: string;
  actionUserId: string;
}) => {
  try {
    const chatRoom = await databases.getDocument<ChannelType>(
      DATABASE_ID,
      CHAT_COLLECTION_ID,
      roomId
    );
    if (!chatRoom) {
      throw new Error('Chat room does not exist');
    }
    const member = await databases.listDocuments<MemberType>(
      DATABASE_ID,
      MEMBER_ID,
      [
        Query.equal('channel_id', roomId),
        Query.equal('member_id', actionUserId),
      ]
    );
    if (
      chatRoom.creator_id !== actionUserId &&
      member.documents[0].access_role !== MemberAccessRole.ADMIN
    ) {
      throw new Error('You are not authorized to perform this action');
    }

    const isAMember = await databases.listDocuments<MemberType>(
      DATABASE_ID,
      MEMBER_ID,
      [Query.equal('channel_id', roomId), Query.equal('member_id', memberId)]
    );
    if (isAMember.total === 0) {
      throw new Error('Member does not exist');
    }
    const newRole =
      isAMember.documents[0].access_role === MemberAccessRole.ADMIN
        ? MemberAccessRole.MEMBER
        : MemberAccessRole.ADMIN;
    await databases.updateDocument(DATABASE_ID, MEMBER_ID, memberId, {
      access_role: newRole,
    });
  } catch (error) {
    throw new Error(
      generateErrorMessage(error, 'Failed to update member role')
    );
  }
};
