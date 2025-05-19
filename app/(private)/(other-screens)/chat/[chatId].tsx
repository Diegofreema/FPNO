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
import { useGetConversationWithMessages } from '@/features/chat/api/use-get-conversation';
import ChatComponent from '@/features/chat/components/chat-component';
import { ChatNav } from '@/features/chat/components/chat-nav';
import { formatNumber } from '@/helper';
import { useIsCreator } from '@/hooks/useIsCreator';
import { useAuth } from '@/lib/zustand/useAuth';
import { useGetImage } from '@/lib/zustand/useGetImage';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { toast } from 'sonner-native';

const ChatId = () => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const loggedInUser = useAuth((state) => state.user?.id!);
  const [more, setMore] = useState(0);
  const [text, setText] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const [hasTriedSending, setHasTriedSending] = useState(false);
  const { mutateAsync, isPending: isSendingMessage } = useSendMessage();
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [messageId, setMessageId] = useState<string>('');
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const height = useSharedValue(0);
  const { showActionSheetWithOptions } = useActionSheet();
  const img = useGetImage((state) => state.image);
  const removeImage = useGetImage((state) => state.removeImage);
  const {
    data: messageData,
    error: messageError,
    isError: isMessageError,
    isPending: isMessagePending,
    isRefetchError,
    isRefetching,
    refetch: isRefetchMessage,
  } = useMessages({ channel_id: chatId, more, loggedInUser });
  const onOpenCamera = useCallback(() => {
    router.push(`/camera?path=${pathname}`);
    setHasTriedSending(false);
  }, [router, pathname]);
  const onPickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      console.log(result.assets);
      setImagePaths(result.assets.map((r) => r.uri));
      setIsAttachImage(true);
    }
  }, []);

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
  const isCreator = useIsCreator({ creatorId: data?.creator_id });

  const { mutateAsync: leaveRoom, isPending: isLeaving } = useLeave();
  const onSend = useCallback(async () => {
    await mutateAsync({
      message: text.trim(),
      channel_id: chatId,
      senderId: loggedInUser,
    });
  }, [chatId, loggedInUser, text, mutateAsync]);
  useEffect(() => {
    if (imagePaths.length) {
      height.value = 90;
    } else {
      height.value = 0;
    }
  }, [imagePaths, height]);
  const copyToClipboard = useCallback(async (textToCopy: string) => {
    const copied = await Clipboard.setStringAsync(textToCopy);
    if (copied) {
      toast.success('Copied to clipboard');
    }
  }, []);
  const onDelete = useCallback(async (messageId: string) => {
    Alert.alert('This is irreversible', 'Delete this message for everyone?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {},
        style: 'destructive',
      },
    ]);
  }, []);
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
    async ({
      textToEdit,
      messageId,
    }: {
      textToEdit: string;
      messageId: string;
    }) => {
      setIsEditing(true);
      setMessageId(messageId);
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
      <LoadingModal visible={isLeaving} />
      {isMember && (
        <ChatComponent
          loadEarlier={loadEarlier}
          messages={messageData.messages || []}
          onLoadMore={onLoadMore}
          onSend={onSend}
          setText={setText}
          imagePaths={imagePaths}
          setImagePaths={setImagePaths}
          sending={sending || isSendingMessage}
          setSending={setSending}
          isAttachImage={isAttachImage}
          setIsAttachImage={setIsAttachImage}
          text={text}
          onOpenCamera={onOpenCamera}
          onPickImage={onPickImage}
          height={height}
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
