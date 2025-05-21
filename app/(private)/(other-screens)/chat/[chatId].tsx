import { LoadingModal } from '@/components/typography/loading-modal';
import { ErrorComponent } from '@/components/ui/error-component';
import { Loading } from '@/components/ui/loading';
import { Wrapper } from '@/components/ui/wrapper';
import {
  useGetMember,
  useGetPendingMember,
} from '@/features/chat-room/api/use-get-member';
import { useLeave } from '@/features/chat-room/api/use-leave';
import { useSendMessage } from '@/features/chat-room/api/use-send-message';
import { useMessages } from '@/features/chat-room/hook/useMessages';
import { useDeleteMessage } from '@/features/chat/api/use-delete-message';
import { useEditMessage } from '@/features/chat/api/use-edit-message';
import { useGetConversationWithMessages } from '@/features/chat/api/use-get-conversation';
import ChatComponent from '@/features/chat/components/chat-component';
import { ChatNav } from '@/features/chat/components/chat-nav';
import { formatNumber, generateImageUrl } from '@/helper';
import { useIsCreator } from '@/hooks/useIsCreator';
import { useAuth } from '@/lib/zustand/useAuth';
import { EditType, EditType2, FileType, IMessage, SendIMessage } from '@/types';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';

import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { toast } from 'sonner-native';
const ChatId = () => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const loggedInUser = useAuth((state) => state.user?.id!);
  const [more, setMore] = useState(0);
  const [text, setText] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const { mutateAsync, isPending: isSendingMessage } = useSendMessage();
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [editText, setEditText] = useState<EditType | null>(null);
  const [edit, setEdit] = useState<{
    messageId: string;
    senderId: string;
  } | null>(null);
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);

  const { showActionSheetWithOptions } = useActionSheet();

  const {
    data: messageData,
    error: messageError,
    isError: isMessageError,
    isPending: isMessagePending,
    isRefetchError,
  } = useMessages({ channel_id: chatId, more, loggedInUser });
  const onOpenCamera = useCallback(() => {
    router.push(`/camera?path=${pathname}`);
  }, [router, pathname]);
  const { mutateAsync: deleteAsync, isPending: isPendingDelete } =
    useDeleteMessage();
  const [sending, setSending] = useState(false);
  const { data, isPending, isError, error, refetch } =
    useGetConversationWithMessages({ roomId: chatId, offSet: more });
  const {
    data: member,
    isPending: isPendingMember,
    isError: isErrorMember,
    error: errorMember,
  } = useGetMember({ channel_id: chatId });
  const {
    data: pendingMember,
    isPending: isPendingPendingMember,
    isError: isErrorPendingMember,
    error: errorPendingMember,
  } = useGetPendingMember({ channel_id: chatId });
  const { mutateAsync: editAsync, isPending: isPendingEdit } = useEditMessage();
  const isCreator = useIsCreator({ creatorId: data?.creator_id });

  const { mutateAsync: leaveRoom, isPending: isLeaving } = useLeave();
  const onSend = useCallback(
    async (messages: SendIMessage[]) => {
      if (edit) {
        await editAsync({
          messageId: edit.messageId,
          senderId: loggedInUser,
          textToEdit: text,
        });
        setEdit(null);
        setEditText(null);
      } else {
        if (replyMessage) {
          setReplyMessage(null);
        }
        messages.forEach(async (message) => {
          await mutateAsync({
            message: message.text,
            channel_id: chatId,
            senderId: loggedInUser,
            fileType: message.fileType,
            fileUrl: message.fileUrl,
            fileId: message.fileId,
            replyTo: message.replyTo,
          });
        });
      }
    },
    [chatId, loggedInUser, mutateAsync, replyMessage, edit, editAsync, text]
  );
  const handleSend = async (messages: IMessage[]) => {
    if (text.trim()) {
      const message = {
        text,
        user: { _id: loggedInUser },
        replyTo: replyMessage?._id as string,
      };
      await onSend([message]);
      setText('');
    }
  };

  const copyToClipboard = useCallback(async (textToCopy: string) => {
    const copied = await Clipboard.setStringAsync(textToCopy);
    if (copied) {
      toast.success('Copied to clipboard');
    }
  }, []);
  const onDelete = useCallback(
    async (messageId: string) => {
      Alert.alert('This is irreversible', 'Delete this message for everyone?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteAsync({ messageId, userId: loggedInUser }),
          style: 'destructive',
        },
      ]);
    },
    [loggedInUser, deleteAsync]
  );
  const handlePhotoTaken = useCallback((message: IMessage) => {}, []);
  const handleFilePick = async () => {
    setSending(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { assets } = result;
        const filePromises = assets.map(async (asset) => {
          const file = {
            uri: asset.uri,
            type: asset.mimeType || 'application/octet-stream',
            name:
              asset.name ||
              `file_${Date.now()}.${
                asset.mimeType?.split('/').pop() || 'file'
              }`,
            size: asset.size || 0,
          };

          const { id, link } = await generateImageUrl(file);

          return {
            id,
            link,
          };
        });

        const fileUrls = await Promise.all(filePromises);

        const messages = fileUrls.map((file) => {
          return {
            text: '',
            user: { _id: loggedInUser },
            fileId: file.id,
            fileUrl: file.link,
            fileType: 'pdf' as FileType,
          };
        });
        onSend(messages);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    } finally {
      setSending(false);
    }
  };
  const handleImagePick = async () => {
    setSending(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.5,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        const { assets } = result;
        const filePromises = assets.map(async (asset) => {
          const file = {
            name: asset.fileName || new Date().toISOString(),
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            size: asset.fileSize || 0,
          };

          const { id, link } = await generateImageUrl(file);

          return {
            id,
            link,
          };
        });

        const fileUrls = await Promise.all(filePromises);

        const messages = fileUrls.map((file) => {
          return {
            text: '',
            user: { _id: loggedInUser },
            fileId: file.id,
            fileUrl: file.link,
            fileType: 'image' as FileType,
          };
        });
        onSend(messages);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      toast.error('Error picking image');
    } finally {
      setSending(false);
    }
  };
  const onLoadMore = useCallback(async () => {
    if (
      messageData.messages &&
      messageData?.messages?.length === messageData.total
    ) {
      return;
    }
    setMore((prev) => prev + 50);
  }, [messageData]);
  const onEdit = useCallback(
    async ({ textToEdit, messageId, senderId, senderName }: EditType2) => {
      setEditText({ text: textToEdit, senderId, senderName });
      setEdit({ messageId, senderId });
      setText(textToEdit);
    },
    []
  );
  const errorMessage =
    error?.message ||
    errorMember?.message ||
    errorPendingMember?.message ||
    messageError?.message;

  if (
    isError ||
    isErrorMember ||
    isErrorPendingMember ||
    isMessageError ||
    isRefetchError
  ) {
    return <ErrorComponent onPress={refetch} title={errorMessage} />;
  }

  if (
    isPending ||
    isPendingMember ||
    isPendingPendingMember ||
    isMessagePending
  ) {
    return <Loading />;
  }

  const followersText = `${formatNumber(data?.members_count)} ${
    data?.members_count > 1 ? 'members' : 'member'
  }`;

  const loadEarlier =
    (messageData.messages?.length || 0) < (messageData.total || 0);
  const isMember = !!member.total;

  return (
    <Wrapper>
      <ChatNav
        name={data.channel_name}
        subText={followersText}
        imageUrl={data.image_url}
        channelId={chatId}
        isCreator={isCreator}
        isMember={isMember}
        isInPending={!!pendingMember.total}
        leaveRoom={() => leaveRoom({ memberId: loggedInUser, roomId: chatId })}
      />
      <LoadingModal visible={isLeaving || isPendingDelete} />
      {isMember && (
        <ChatComponent
          replyMessage={replyMessage}
          editText={editText}
          setEditText={setEditText}
          setReplyMessage={setReplyMessage}
          handlePhotTaken={handlePhotoTaken}
          loadEarlier={loadEarlier}
          messages={messageData.messages || []}
          onLoadMore={onLoadMore}
          onSend={handleSend}
          setText={setText}
          sending={sending || isSendingMessage || isPendingEdit}
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
