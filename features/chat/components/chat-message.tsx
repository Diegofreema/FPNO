import { IMessage } from '@/types';
import React from 'react';
import { Text, View } from 'react-native';
import { MessageProps } from 'react-native-gifted-chat';

type Props = MessageProps<IMessage> & {
  setReplyOnSwipeOpen: (message: IMessage) => void;
  updateRowRef: (ref: any) => void;
};

export const ChatMessage = ({
  setReplyOnSwipeOpen,
  updateRowRef,
  ...props
}: Props) => {
  return (
    <View>
      <Text>ChatMessage</Text>
    </View>
  );
};
