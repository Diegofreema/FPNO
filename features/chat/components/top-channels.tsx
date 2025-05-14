import { ChannelType } from '@/types';
import { LegendList } from '@legendapp/list';
import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { TopChannel } from './top-channel';

type Props = {
  channels: ChannelType[];
};

export const TopChannels = ({ channels }: Props) => {
  const { height } = useWindowDimensions();

  return (
    <View
      style={{
        height: height * 0.08,
      }}
    >
      <LegendList
        data={channels}
        renderItem={({ item }) => <TopChannel channel={item} />}
        keyExtractor={(item) => item.$id}
        recycleItems
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
      />
    </View>
  );
};
