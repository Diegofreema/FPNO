import { Avatar } from '@/components/ui/avatar';
import { CustomPressable } from '@/components/ui/custom-pressable';
import { ChannelType } from '@/types';
import { useRouter } from 'expo-router';
import React from 'react';
import { useWindowDimensions } from 'react-native';

type Props = {
  channel: ChannelType;
};

export const TopChannel = ({ channel }: Props) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const onPress = () => {
    router.push(`/chat/${channel.$id}`);
  };
  return (
    <CustomPressable onPress={onPress}>
      <Avatar size={width / 6} imgSrc={channel.image_url} />
    </CustomPressable>
  );
};
