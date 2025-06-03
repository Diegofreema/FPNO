import {LoadingModal} from "@/components/typography/loading-modal";
import {Loading} from "@/components/ui/loading";
import {Wrapper} from "@/components/ui/wrapper";
import {useDeleteMessage} from "@/features/chat/api/use-delete-message";
import {useEditMessage} from "@/features/chat/api/use-edit-message";
import ChatComponent from "@/features/chat/components/chat-component";
import {ChatNav} from "@/features/chat/components/chat-nav";
import {formatNumber, generateErrorMessage, uploadProfilePicture} from "@/helper";
import {useAuth} from "@/lib/zustand/useAuth";
import {EditType, EditType2, FileType, IMessage, ReplyType, SendIMessage,} from "@/types";
import {useActionSheet} from "@expo/react-native-action-sheet";
import * as Clipboard from "expo-clipboard";
import * as DocumentPicker from "expo-document-picker";
import {useMutation, usePaginatedQuery, useQuery as useConvexQuery,} from "convex/react";
import * as ImagePicker from "expo-image-picker";
import {Redirect, useLocalSearchParams, usePathname, useRouter,} from "expo-router";
import React, {useCallback, useState} from "react";
import {Alert} from "react-native";
import {toast} from "sonner-native";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const ChatId = () => {
  const { chatId } = useLocalSearchParams<{ chatId: Id<"rooms"> }>();
  // const convexIdOfLoggedInUser = useAuth((state) => state.user?.convexId!);
  const convexIdOfLoggedInUser = useAuth((state) => state.user?.convexId!);
  const [processing, setProcessing] = useState(false);
  const [text, setText] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const sendMessage = useMutation(api.message.sendMessage);
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [editText, setEditText] = useState<EditType | null>(null);
  const [edit, setEdit] = useState<{
    messageId: string;
    senderId: string;
  } | null>(null);
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  const { showActionSheetWithOptions } = useActionSheet();
const generateUploadUrl = useMutation(api.user.generateUploadUrl)
  const onOpenCamera = useCallback(() => {
    router.push(`/camera?path=${pathname}`);
  }, [router, pathname]);
  const { mutateAsync: deleteAsync, isPending: isPendingDelete } =
    useDeleteMessage();
  const [sending, setSending] = useState(false);

  const room = useConvexQuery(api.room.room, { room_id: chatId });
  const isMember = useConvexQuery(api.room.isMember, {
    room_id: chatId,
    member_id: convexIdOfLoggedInUser,
  });
  const pendingMember = useConvexQuery(api.room.isInPending, {
    room_id: chatId,
    member_id: convexIdOfLoggedInUser,
  });
  const messages = usePaginatedQuery(
    api.message.getMessages,
    { room_id: chatId },
    { initialNumItems: 50 },
  );

  const { mutateAsync: editAsync, isPending: isPendingEdit } = useEditMessage();
  const isCreator = room?.creator_id === convexIdOfLoggedInUser;

  const leaveRoom = useMutation(api.member.leaveRoom);
  const onSend = useCallback(
    async (messages: SendIMessage[]) => {
      try {
        if (edit) {
          await editAsync({
            messageId: edit.messageId,
            senderId: convexIdOfLoggedInUser,
            textToEdit: text,
          });
          setEdit(null);
          setEditText(null);
        } else {
          if (replyMessage) {
            setReplyMessage(null);
          }
          for (const message of messages) {
            await sendMessage({
              message: message.text,
              room_id: chatId,
              sender_id: convexIdOfLoggedInUser,
              file_type: message.fileType,
              file_url: message.fileUrl,
              file_id: message.fileId,
              reply_to: message.replyTo,
            });
          }
        }
      } catch (e) {
        console.log("Error message", e);
      }
    },
    [
      chatId,
      convexIdOfLoggedInUser,
      sendMessage,
      replyMessage,
      edit,
      editAsync,
      text,
    ],
  );
  const handleSend = async () => {
    if (text.trim()) {
      const message = {
        text,
        user: { _id: convexIdOfLoggedInUser },
        replyTo: replyMessage?._id as Id<"messages">,
      };
      await onSend([message]);
      setText("");
    }
  };

  const copyToClipboard = useCallback(async (textToCopy: string) => {
    const copied = await Clipboard.setStringAsync(textToCopy);
    if (copied) {
      toast.success("Copied to clipboard");
    }
  }, []);
  const onDelete = useCallback(
    async (messageId: string) => {
      Alert.alert("This is irreversible", "Delete this message for everyone?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () =>
            deleteAsync({ messageId, userId: convexIdOfLoggedInUser }),
          style: "destructive",
        },
      ]);
    },
    [convexIdOfLoggedInUser, deleteAsync],
  );
  const handlePhotoTaken = useCallback((message: IMessage) => {
    console.log(message);
  }, []);
  const handleFilePick = async () => {
    setSending(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { assets } = result;
        const filePromises = assets.map(async (asset) => {


          const res = await uploadProfilePicture(generateUploadUrl, asset.uri)
          return {
            id: res?.storageId as Id<"_storage">,

          };
        });

        const fileUrls = await Promise.all(filePromises);

        const messages = fileUrls.map((file) => {
          return {
            text: "",
            user: { _id: convexIdOfLoggedInUser },
            fileId: file.id,
            fileType: "pdf" as FileType,
          };
        });
        void onSend(messages);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    } finally {
      setSending(false);
    }
  };
  const handleImagePick = async () => {
    setSending(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.5,
        allowsMultipleSelection: true,
        base64: false,
      });

      if (!result.canceled) {
        const { assets } = result;

        const filePromises = assets.map(async (asset) => {
          const res = await uploadProfilePicture(generateUploadUrl, asset.uri)
          return {
            id: res?.storageId as Id<"_storage">,

          };
        });

        const fileUrls = await Promise.all(filePromises);

        const messages = fileUrls.map((file) => {
          return {
            text: "",
            user: { _id: convexIdOfLoggedInUser },
            fileId: file.id,
            fileType: "image" as FileType,
          };
        });
        await onSend(messages);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      toast.error("Error picking image");
    } finally {
      setSending(false);
    }
  };
  const { status, loadMore, isLoading, results } = messages;
  const loadEarlier = status === "CanLoadMore" && !isLoading;
  const onLoadMore = useCallback(async () => {
    if (loadEarlier) {
      loadMore(100);
    }
  }, [loadEarlier, loadMore]);
  const formattedMessages = results.map((message) => ({
    _id: message?._id,
    text: message?.message,
    createdAt: new Date(message?._creationTime),
    user: {
      _id: message?.user?._id!,
      name:
        message.sender_id === convexIdOfLoggedInUser
          ? "You"
          : (message?.user?.name as string),
    },
    reactions: message.reactions,
    fileType: message.file_type,
    fileUrl: message.file_url,
    reply: message.reply as ReplyType,
  }));
  const onEdit = useCallback(
    async ({ textToEdit, messageId, senderId, senderName }: EditType2) => {
      setEditText({ text: textToEdit, senderId, senderName });
      setEdit({ messageId, senderId });
      setText(textToEdit);
    },
    [],
  );

  if (
    room === undefined ||
    isMember === undefined ||
    pendingMember === undefined
  ) {
    return <Loading />;
  }

  if (room === null) {
    toast("Room does not exist!!!");
    return <Redirect href={"/chat"} />;
  }

  const followersText = `${formatNumber(room?.member_count)} ${
    room?.member_count > 1 ? "members" : "member"
  }`;

  const onLeave = async () => {
    setProcessing(true);
    try {
      await leaveRoom({ member_id: convexIdOfLoggedInUser, room_id: chatId });
      toast.success("You have left the room");
    } catch (e) {
      const errorMessage = generateErrorMessage(e, "Error leaving room");
      router.replace("/chat");
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };
  console.log({replyMessage})
  console.log({messages: results})
  return (
    <Wrapper>
      <ChatNav
        name={room.room_name}
        subText={followersText}
        imageUrl={room.image_url!}
        channelId={chatId}
        isCreator={isCreator}
        isMember={isMember}
        isInPending={pendingMember}
        leaveRoom={onLeave}
      />
      <LoadingModal visible={processing || isPendingDelete} />
      {isMember && (
        <ChatComponent
          replyMessage={replyMessage}
          editText={editText}
          setEditText={setEditText}
          setReplyMessage={setReplyMessage}
          handlePhotTaken={handlePhotoTaken}
          loadEarlier={loadEarlier}
          messages={formattedMessages || []}
          onLoadMore={onLoadMore}
          onSend={handleSend}
          setText={setText}
          sending={sending || isPendingEdit}
          setSending={setSending}
          isAttachImage={isAttachImage}
          setIsAttachImage={setIsAttachImage}
          text={text}
          onOpenCamera={onOpenCamera}
          onPickImage={handleImagePick}
          onPickDocument={handleFilePick}
          onCopy={copyToClipboard}
          showActionSheetWithOptions={showActionSheetWithOptions}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
    </Wrapper>
  );
};

export default ChatId;
