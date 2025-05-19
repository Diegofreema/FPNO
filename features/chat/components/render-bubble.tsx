import { ActionSheetOptions } from '@expo/react-native-action-sheet';
import React, { useRef, useState } from 'react';
import { BubbleProps } from 'react-native-gifted-chat';

import { CustomPressable } from '@/components/ui/custom-pressable';
import { colors } from '@/constants';
import { IMessage } from '@/types';
import { Image } from 'expo-image';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { EmojiPickerModal } from './emoji-modal';
import { InChatFileTransfer } from './in-chat-file-transfer';
import { InChatViewFile } from './in-chat-view-file';

const { width } = Dimensions.get('window');
type Props = BubbleProps<IMessage> & {
  onCopy: (text: string) => void;
  showActionSheetWithOptions(
    options: ActionSheetOptions,
    callback: (i?: number) => void | Promise<void>
  ): void;
  onEdit: ({
    textToEdit,
    messageId,
  }: {
    textToEdit: string;
    messageId: string;
  }) => void;
  onDelete: (messageId: string) => void;
  loggedInUserId: string;
};

export const RenderBubble = ({
  onCopy,
  showActionSheetWithOptions,
  onEdit,
  onDelete,
  loggedInUserId,
  currentMessage,
  ...props
}: Props) => {
  const [fileVisible, setFileVisible] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const bubbleRef = useRef<View>(null);

  const isSent = currentMessage.user._id === loggedInUserId;
  // const onPress = () => {
  //   const options = ['Delete', 'Copy text', 'Edit', 'Cancel'];
  //   const destructiveButtonIndex = 0;
  //   const cancelButtonIndex = 3;

  //   showActionSheetWithOptions(
  //     {
  //       options,
  //       cancelButtonIndex,
  //       destructiveButtonIndex,
  //     },
  //     (selectedIndex?: number) => {
  //       console.log(selectedIndex);
  //       switch (selectedIndex) {
  //         case 1:
  //           onCopy(currentMessage.text);
  //           break;
  //         case 2:
  //           onEdit({
  //             textToEdit: currentMessage.text,
  //             messageId: currentMessage._id as string,
  //           });
  //           break;
  //         case destructiveButtonIndex:
  //           onDelete(currentMessage._id as string);
  //           break;

  //         case cancelButtonIndex:
  //         // Canceled
  //       }
  //     }
  //   );
  // };
  const handleEmojiSelect = async (emoji: string) => {
    try {
      console.log(emoji);

      // Reaction is updated via Appwrite subscription in ChatScreen
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };
  const handleLongPress = () => {
    if (bubbleRef.current) {
      bubbleRef.current.measure((x, y, w, h, pageX, pageY) => {
        setPickerPosition({
          top: pageY - 60, // Position above bubble
          left: Math.max(16, pageX - (emojis.length * 40) / 2), // Center horizontally
        });
        setPickerVisible(true);
      });
    }
  };
  const renderContent = () => {
    if (currentMessage.fileType === 'image' && currentMessage.fileUrl) {
      return (
        <Image
          source={{ uri: currentMessage.fileUrl }}
          style={[
            styles.image,
            isSent ? styles.sentImage : styles.receivedImage,
          ]}
          contentFit="cover"
        />
      );
    } else if (currentMessage.fileType === 'pdf' && currentMessage.fileUrl) {
      return (
        <TouchableOpacity style={styles.pdfContainer}>
          <Pdf
            source={{ uri: currentMessage.fileUrl }}
            style={styles.pdf}
            singlePage
          />
          <Text style={styles.pdfText}>PDF Document</Text>
        </TouchableOpacity>
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
            {emoji.emoji}
          </Text>
        ))}
      </View>
    );
  };
  if (currentMessage.audio) {
    return (
      <CustomPressable
        style={{
          backgroundColor:
            currentMessage.user._id === loggedInUserId ? '#2e64e5' : '#efefef',
          borderBottomLeftRadius:
            currentMessage.user._id === loggedInUserId ? 15 : 5,
          borderBottomRightRadius:
            currentMessage.user._id === loggedInUserId ? 5 : 15,
          height: 100,
        }}
        onPress={() => setFileVisible(true)}
      >
        <InChatFileTransfer
          style={{ marginTop: -10 }}
          filePath={currentMessage.audio}
        />
        <InChatViewFile
          uri={currentMessage.audio}
          visible={fileVisible}
          onClose={() => setFileVisible(false)}
        />
      </CustomPressable>
    );
  }
  return (
    <>
      <TouchableOpacity
        onLongPress={handleLongPress}
        delayLongPress={300}
        activeOpacity={0.8}
        style={[styles.container, styles.receivedContainer]}
        ref={bubbleRef}
        accessibilityLabel="Message bubble, long press to react"
      >
        {renderContent()}
        <Text style={styles.time}>
          {new Date(currentMessage.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        {renderReactions()}
      </TouchableOpacity>
      <EmojiPickerModal
        visible={isPickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={handleEmojiSelect}
        position={pickerPosition}
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
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 12,
    padding: 8,
  },
  sentContainer: {
    backgroundColor: '#DCF8C6', // WhatsApp green for sent
    alignSelf: 'flex-end',
  },
  receivedContainer: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
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
    backgroundColor: colors.lightblue,
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  receivedTextContainer: {
    backgroundColor: colors.lightGray,
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  sentImage: {
    borderBottomRightRadius: 2,
  },
  receivedImage: {
    borderBottomLeftRadius: 2,
  },
  pdfContainer: {
    alignItems: 'center',
  },
  pdf: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  pdfText: {
    marginTop: 4,
    fontSize: 14,
    color: '#007AFF',
  },
  time: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  reactionEmoji: {
    fontSize: 14,
    marginHorizontal: 2,
  },
});
const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
