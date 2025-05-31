import { ActionSheetOptions } from '@expo/react-native-action-sheet';
import React, { useRef, useState } from 'react';
import { BubbleProps } from 'react-native-gifted-chat';

import { colors } from '@/constants';
// import { emojis } from '@/data';
import { emojis } from '@/data';
import {
  SelectedMessage,
  useSelected,
} from '@/features/chat-room/hook/use-selected';
import { onReactToMessage } from '@/features/chat-room/server';
import { useFileUrlStore } from '@/hooks/use-file-url';
import { EditType2, FileType, IMessage, Reaction_Enum } from '@/types';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { CircleChevronDown, Reply } from 'lucide-react-native';
import {
  Dimensions, Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Pdf from 'react-native-pdf';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { toast } from 'sonner-native';
import { ChatMenu } from './chat-menu';
import { EmojiPickerModal } from './emoji-modal';
import { RenderReply } from './render-reply';

const { width } = Dimensions.get('window');
type Props = BubbleProps<IMessage> & {
  setReplyOnSwipeOpen: (message: IMessage) => void;
  updateRowRef: (ref: any) => void;
  onCopy: (text: string) => void;
  showActionSheetWithOptions(
    options: ActionSheetOptions,
    callback: (i?: number) => void | Promise<void>
  ): void;
  onEdit: (value: EditType2) => void;
  onDelete: (messageId: string) => void;
  loggedInUserId: string;
};

function LeftAction(
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  swipeableMethods: SwipeableMethods
) {
  const styleAnimation = useAnimatedStyle(() => {


    return {
      transform: [{ translateX: drag.value + 50 }],
    };
  });

  return (
    <Animated.View style={styleAnimation}>
      <Reply color={colors.black} />
    </Animated.View>
  );
}

export const RenderBubble = ({
  onCopy,
  onEdit,
  onDelete,
  loggedInUserId,
  currentMessage,
  updateRowRef,
  setReplyOnSwipeOpen,
}: Props) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });

  const { selected, setSelected, removeSelected } = useSelected();
  const messageIsSelected = !!selected.find(
    (message) => message.messageId === currentMessage._id
  );


  const selectedIsNotEmpty = selected.length > 0;

  const bubbleRef = useRef<View>(null);
  const router = useRouter();
  const getFile = useFileUrlStore((state) => state.setFileUrl);

  const onPress = (
    url: string | undefined,
    type: FileType | undefined,
    selectedMessage: SelectedMessage | undefined
  ) => {
    if (selectedIsNotEmpty && !messageIsSelected) {
      setSelected({
        messageId: currentMessage._id.toString(),
        senderId: currentMessage.user._id.toString(),
      });
      return;
    }
    if (selectedIsNotEmpty && selectedMessage) {
      removeSelected(selectedMessage);
      return;
    }

    if (!url || !type) return;
    getFile({ type, url });
    router.push('/preview-file');
  };
  const findEmojiISelected = currentMessage.reactions?.find(
    (reaction) => reaction.user_id === loggedInUserId
  );

  const isSent = currentMessage.user._id === loggedInUserId;

  const handleEmojiSelect = async (emoji: string) => {
    try {
      await onReactToMessage({
        messageId: currentMessage._id as string,
        reaction: emoji as Reaction_Enum,
        senderId: loggedInUserId as string,
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Error adding reaction');
    }
  };

  const handleLongPress = () => {
    if (isSent) {
      setSelected({
        messageId: currentMessage._id as string,
        senderId: currentMessage.user._id,
      });
    }
    if (selected.length > 0) return;
    if (bubbleRef.current) {
      bubbleRef.current.measure((x, y, w, h, pageX, pageY) => {
        const bubbleCenter = pageX + width / 2;
        // Calculate the width of the emoji picker (40px per emoji)
        const pickerWidth = emojis.length * 45;
        setPickerPosition({
          top: pageY - 60, // Position above bubble
          left: Math.max(
            16,
            Math.min(
              Dimensions.get('window').width - pickerWidth - 16,
              bubbleCenter - pickerWidth / 2
            )
          ), // Center horizontally
        });
        setPickerVisible(true);
      });
    }
  };



  const renderContent = () => {
    if (currentMessage.fileType === 'image' && currentMessage.fileUrl) {
      return (
        <View
          style={[
            styles.image,
            isSent ? styles.sentImage : styles.receivedImage,
          ]}
        >
          <Image
            source={{ uri: currentMessage.fileUrl }}
            style={{ width: '100%', height: '100%' }}
            placeholder={require('@/assets/images/place.webp')}
            placeholderContentFit="cover"
            contentFit="cover"
          />
        </View>
      );
    } else if (currentMessage.fileType === 'pdf' && currentMessage.fileUrl) {
      const pdfUrl = currentMessage.fileUrl?.split('&mode=admin')[0]
      console.log(pdfUrl)
      return (
        <View style={styles.pdfContainer}>
          <Pdf
            source={{ uri: pdfUrl, cache: true }}
            style={styles.pdf}
            singlePage
            trustAllCerts={Platform.OS !== 'android'}
          />
        </View>
      );
    } else {
      return (
        <View
          style={
            isSent ? styles.sentTextContainer : styles.receivedTextContainer
          }
        >
          <Text
            style={[
              styles.text,
              isSent ? styles.sentText : styles.receivedText,
            ]}
          >
            {currentMessage.text}
          </Text>
        </View>
      );
    }
  };
  const renderReactions = () => {
    if (!currentMessage.reactions) return null;
    const reactionEmojis = Object.values(currentMessage.reactions);
    if (reactionEmojis.length === 0) return null;

    return (
      <View style={styles.reactionsContainer}>
        {reactionEmojis.map((emoji, index) => (
          <Text key={index} style={styles.reactionEmoji}>
            {renderEmoji[emoji.emoji]}
          </Text>
        ))}
        <Text>{reactionEmojis.length > 1 && reactionEmojis.length}</Text>
      </View>
    );
  };

  const onSwipeAction = () => {
    if (currentMessage) {
      setReplyOnSwipeOpen({ ...currentMessage });
    }
  };

  const isText = currentMessage.text.trim() !== '';
  const isMine = currentMessage.user._id === loggedInUserId;
  const menuItems = [
    ...(isMine && currentMessage._id
      ? [
          {
            text: 'Delete',
            onSelect: () => onDelete(currentMessage._id as string),
          },
        ]
      : []),
    ...(isText && currentMessage.text
      ? [
          {
            text: 'Copy',
            onSelect: () => onCopy(currentMessage.text),
          },
        ]
      : []),
    ...(isText && isMine && currentMessage._id && currentMessage.text
      ? [
          {
            text: 'Edit',
            onSelect: () =>
              onEdit({
                messageId: currentMessage._id as string,
                textToEdit: currentMessage.text,
                senderId: currentMessage.user._id,
                senderName: currentMessage.user.name,
              }),
          },
        ]
      : []),
  ];
  return (
    <>
      <ReanimatedSwipeable
        renderLeftActions={LeftAction}
        friction={2}
        enableTrackpadTwoFingerGesture
        leftThreshold={40}
        containerStyle={{
          width: '100%',
          backgroundColor: messageIsSelected
            ? 'rgba(0,0,0, 0.2)'
            : 'transparent',
        }}
        ref={updateRowRef}
        onSwipeableOpen={onSwipeAction}
      >
        <TouchableOpacity
          onLongPress={handleLongPress}
          onPress={() =>
            onPress(currentMessage.fileUrl, currentMessage.fileType, {
              messageId: currentMessage._id.toString(),
              senderId: currentMessage.user._id.toString(),
            })
          }
          delayLongPress={300}
          activeOpacity={0.8}
          style={[
            styles.container,
            isSent ? styles.sentContainer : styles.receivedContainer,
          ]}
          ref={bubbleRef}
          accessibilityLabel="Message bubble, long press to react"
        >
          <ChatMenu
            width={24}
            alignSelf="flex-end"
            trigger={
              <CircleChevronDown
                color={isSent ? colors.white : colors.lightblue}
                size={15}
                style={{ alignSelf: 'flex-end', marginBottom: 3 }}
              />
            }
            menuItems={menuItems}
            disable={selectedIsNotEmpty}
          />

          {currentMessage.reply?.sender_id && (
            <RenderReply message={currentMessage.reply} />
          )}
          {renderContent()}

          <Text
            style={[
              styles.time,
              isSent ? styles.timeSent : styles.timeReceived,
            ]}
          >
            {new Date(currentMessage.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {renderReactions()}
        </TouchableOpacity>
      </ReanimatedSwipeable>
      <EmojiPickerModal
        visible={isPickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={handleEmojiSelect}
        position={pickerPosition}
        findEmojiISelected={findEmojiISelected}
      />
    </>
    // <Bubble
    //   {...props}
    //   currentMessage={currentMessage}
    //   onLongPress={onPress}
    //   textStyle={{
    //     right: {
    //       color: '#000',
    //     },

    //     left: {
    //       color: '#fff',
    //     },
    //   }}
    //   wrapperStyle={{
    //     left: {
    //       backgroundColor: colors.lightblue,
    //     },
    //     right: {
    //       backgroundColor: colors.lightGray,
    //     },
    //   }}
    // />
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: width * 0.75,
    minWidth: width * 0.25,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 12,
    padding: 8,
  },
  sentContainer: {
    backgroundColor: colors.lightblue,

    // WhatsApp green for sent
    alignSelf: 'flex-end',
  },
  receivedContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lightGray,
  },
  text: {
    fontSize: 16,
  },
  sentText: {
    color: colors.white,
  },
  receivedText: {
    color: '#000',
  },
  sentTextContainer: {
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  receivedTextContainer: {
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  sentImage: {
    borderBottomRightRadius: 2,
  },
  receivedImage: {
    borderBottomLeftRadius: 2,
  },
  pdfContainer: {
    width: 200,
    height: 200,
  },
  pdf: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  rightAction: { width: 50, height: 50, backgroundColor: 'purple' },

  time: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  timeSent: {
    color: '#fff',
  },
  timeReceived: {
    color: colors.lightblue,
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    bottom: -5,
    left: 10,
    zIndex: 1000,
  },
  reactionEmoji: {
    fontSize: 14,
    marginHorizontal: 2,
  },
});

const renderEmoji = {
  LIKE: '👍',
  LOVE: '❤️',
  LAUGH: '😂',
  WOW: '😮',
  SAD: '😢',
  ANGRY: '😡',
};
