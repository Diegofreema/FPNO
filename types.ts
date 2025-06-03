import {ImagePickerAsset} from "expo-image-picker";

import {upcoming} from "./data";
import {Doc, Id} from "@/convex/_generated/dataModel";
import {Infer, v} from "convex/values";

export type DataType = (typeof upcoming)[0];

export enum MemberAccessRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum MemberStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
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
  contentType: "image" | "text" | "pdf";
  seenId: string[];
  image?: string;
  pdf?: string;
};

export type SingleMessageType = Omit<GroupMessageType, "senderName">;
export type NewConversationType = {
  id: Id<"users">;
  name: string;
  image: string;
  userId: string;
};

export type PaginateType = {
  isLoading: boolean;
  loadMore: (numItems: number) => void;
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
};

export type Variants = "LECTURER" | "STUDENT";

export type StudentData = {
  variant: "STUDENT";
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
  variant: "LECTURER";
  email: string;
  id: string;
  fullname: string;
  phone: string;
};

export type User = {
  name: string;
  email: string;
  id: string;
  variant: "LECTURER" | "STUDENT";
  Department: string;
  Faculty: string;
  birthday: string;
  matricnumber: string;
  phone: string;
  programtype: string;
  convexId: Id<"users">;
};

export type userData = StudentData | LecturerData;

export type ErrorType = {
  message: string;
};

export type MessageReactionsType = {
  message_id: string;
  user_id: string;
  emoji: EmojiType;
};

export enum Reaction_Enum {
  LIKE = "LIKE",
  LOVE = "LOVE",
  WOW = "WOW",
  SAD = "SAD",
  ANGRY = "ANGRY",
  LAUGH = "LAUGH",
}

export const emojiType = v.union(
  v.literal("LIKE"),
  v.literal("SAD"),
  v.literal("LOVE"),
  v.literal("WOW"),
  v.literal("ANGRY"),
  v.literal("LAUGH"),
);

export type RoomMemberType = Doc<"members"> & {
  user: Doc<"users"> | null;
};

export type EmojiType = Infer<typeof emojiType>;
export interface IMessage {
  _id: Id<"messages">;
  text: string;
  createdAt: Date | number;
  user: {
    _id: Id<"users">;
    name: string;
  };
  image?: string;
  fileType?: FileType;
  audio?: string;
  fileUrl?: string;
  reactions?: MessageReactionsType[];
  reply?: ReplyType;
}
export interface SendIMessage {
  text: string;

  image?: ImagePickerAsset;
  fileType?: FileType;
  audio?: string;
  fileUrl?: string;
  fileId?: Id<"_storage">;
  replyTo?: Id<"messages">;
}

export type FileType = "pdf" | "image" | "audio";

export type ReplyType = {
  fileType: FileType;
  fileUrl: string;
  message: string;
  sender_id: string;
  user: {
    name: string;
    id: string;
  };
};

export type EditType = { text: string; senderId: string; senderName: string };

export type EditType2 = {
  textToEdit: string;
  messageId: Id<"messages">;
  senderId: Id<"users">;
  senderName: string;
};

export type ServerEdit = Omit<EditType2, "senderName">;
