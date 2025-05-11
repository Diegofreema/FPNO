import { upcoming } from './data';

export type DataType = (typeof upcoming)[0];

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
