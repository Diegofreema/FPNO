import { ChannelType } from '@/types';
import { LegendList } from '@legendapp/list';
import React from 'react';
import { TopChannel } from './top-channel';

type Props = {
  channels: ChannelType[];
};

export const TopChannels = ({ channels }: Props) => {
  return (
    <LegendList
      data={channels}
      renderItem={({ item }) => <TopChannel channel={item} />}
      keyExtractor={(item) => item.$id}
      recycleItems
    />
  );
};
