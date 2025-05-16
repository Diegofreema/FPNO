import { ChannelType, MemberType } from '@/types';
import React from 'react';
import { Text, View } from 'react-native';
import { Models } from 'react-native-appwrite';

type Props = {
  data: { data: ChannelType; memberData: Models.DocumentList<MemberType> }[];
  handleMore: () => void;
  onRefresh: boolean;
  refresh: () => void;
};

export const RoomInfo = ({ data, handleMore, onRefresh, refresh }: Props) => {
  return (
    <View>
      <Text>RoomInfo</Text>
    </View>
  );
};
