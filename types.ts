import { ImagePickerAsset } from 'expo-image-picker';
import { Models } from 'react-native-appwrite';
import { upcoming } from './data';

export type DataType = (typeof upcoming)[0];

export enum MemberAccessRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum MemberStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
}
export type DashBoardType = {
  outstandingassignment: string;
  registeredcourse: string;
  totallectures: string;
  upcominglectures: string;
};

export type LecturesType = {
  coursecode: string;
  period: string;
  Hall: string;
  timetableid: string;
  courseid: string;
  lecturer: string;
};

export type NewsTypes = {
  messages: string;
  date1: string;
  heading: string;
};

export type ConversationType = {
  $id: string;
  lastMessage: string | undefined;
  lastMessageTime: number | undefined;
  otherUser: string;
  lastMessageSenderId: string;
};
export type GroupConversationType = {
  $id: string;
  lastMessage: string | undefined;
  name: string | undefined;
  lastMessageTime: number | undefined;
  otherUsers: string[];
  lastMessageSenderId: string;
  createdBy: string;
};
export type GroupMessageType = {
  senderName: string;
  $id: string;

  isEdited?: boolean | undefined;

  senderId: string;
  recipient: string[];
  conversationId: string;
  content: string;
  contentType: 'image' | 'text' | 'pdf';
  seenId: string[];
  image?: string;
  pdf?: string;
};

export type SingleMessageType = Omit<GroupMessageType, 'senderName'>;
export type NewConversationType = {
  id: string;
  name: string;
  image: string;
  userId: string;
};

export type PaginateType = {
  isLoading: boolean;
  loadMore: (numItems: number) => void;
  status: 'LoadingFirstPage' | 'CanLoadMore' | 'LoadingMore' | 'Exhausted';
};

export type Variants = 'LECTURER' | 'STUDENT';

export type StudentData = {
  variant: 'STUDENT';
  Department: string;
  Faculty: string;
  birthday: string;
  email: string;
  fname: string;
  id: string;
  lname: string;
  matricnumber: string;
  mname: string;
  phone: string;
  programtype: string;
};

export type LecturerData = {
  variant: 'LECTURER';
  email: string;
  id: string;
  fullname: string;
  phone: string;
};

export type userData = StudentData | LecturerData;

export type UserType = Models.Document & {
  name: string;
  userId: string;
  email: string;
  is_online: boolean;
  image_url?: string;
  faculty?: string;
  department?: string;
  program_type?: string;
  matriculation_number?: string;
};

export type ChannelType = Models.Document & {
  channel_name: string;
  creator_id: string;
  last_message: string;
  last_message_time: string;
  description: string;
  image_url: string;
  members_count: number;
};

export type PendingMembersType = Models.Document & {
  channel_id: string;
  member_to_join: string;
};

export type ChannelTypeWithPendingMembers = ChannelType & {
  pendingMembers?: MemberType[];
};

export type MemberType = Models.Document & {
  access_role: MemberAccessRole;
  channel_id: string;
  member_id: string;
  status: MemberStatus;
};

export type ChatMessageType = Models.Document & {
  sender_id: string;
  channel_id: string;
  message: string;
  seen_ids: string[];
  sent_to: string[];

  // content_type: 'image' | 'text' | 'pdf';
};

export type ErrorType = {
  message: string;
};

export type MemberWithUserProfile = {
  user: UserType;
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  access_role: MemberAccessRole;
  channel_id: string;
  member_id: string;
  status: MemberStatus;
};

export type SendMessageType = {
  senderId: string;
  channel_id: string;
  message: string;
};

export type MessageReactionsType = Models.Document & {
  message_id: string;
  user_id: string;
  emoji: Reaction_Enum;
};

export enum Reaction_Enum {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  WOW = 'WOW',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  LAUGH = 'LAUGH',
}

export interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: {
    _id: string;
    name: string;
  };
  image?: string;
  fileType?: 'pdf' | 'image' | 'audio';
  audio?: string;
  fileUrl?: string;
  reactions?: MessageReactionsType[];
}
export interface SendIMessage {
  text: string;

  image?: ImagePickerAsset;
  fileType?: 'pdf' | 'image' | 'audio';
  audio?: string;
  fileUrl?: string;
}
