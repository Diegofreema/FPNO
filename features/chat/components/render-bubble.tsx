import { ActionSheetOptions } from '@expo/react-native-action-sheet';
import React, { useState } from 'react';
import { Bubble, BubbleProps, IMessage } from 'react-native-gifted-chat';

import { colors } from '@/constants';

import { CustomPressable } from '@/components/ui/custom-pressable';
import { InChatFileTransfer } from './in-chat-file-transfer';
import { InChatViewFile } from './in-chat-view-file';

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
  ...props
}: Props) => {
  const [fileVisible, setFileVisible] = useState(false);
  const onPress = () => {
    const options = ['Delete', 'Copy text', 'Edit', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex?: number) => {
        console.log(selectedIndex);
        switch (selectedIndex) {
          case 1:
            onCopy(props.currentMessage.text);
            break;
          case 2:
            onEdit({
              textToEdit: props.currentMessage.text,
              messageId: props.currentMessage._id as string,
            });
            break;
          case destructiveButtonIndex:
            onDelete(props.currentMessage._id as string);
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };
  if (props.currentMessage.audio) {
    return (
      <CustomPressable
        style={{
          backgroundColor:
            props.currentMessage.user._id === 2 ? '#2e64e5' : '#efefef',
          borderBottomLeftRadius:
            props.currentMessage.user._id === loggedInUserId ? 15 : 5,
          borderBottomRightRadius:
            props.currentMessage.user._id === loggedInUserId ? 5 : 15,
          height: 100,
        }}
        onPress={() => setFileVisible(true)}
      >
        <InChatFileTransfer
          style={{ marginTop: -10 }}
          filePath={props.currentMessage.audio}
        />
        <InChatViewFile
          uri={props.currentMessage.audio}
          visible={fileVisible}
          onClose={() => setFileVisible(false)}
        />
      </CustomPressable>
    );
  }
  return (
    <Bubble
      {...props}
      onLongPress={onPress}
      textStyle={{
        right: {
          color: '#000',
        },

        left: {
          color: '#fff',
        },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: colors.lightblue,
        },
        right: {
          backgroundColor: colors.lightGray,
        },
      }}
    />
  );
};
