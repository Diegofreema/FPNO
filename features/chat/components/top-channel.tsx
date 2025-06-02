import {Avatar} from '@/components/ui/avatar';
import {CustomPressable} from '@/components/ui/custom-pressable';
import {useRouter} from 'expo-router';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {Doc} from "@/convex/_generated/dataModel";

type Props = {
  channel: Doc<'rooms'>;
};

export const TopChannel = ({ channel }: Props) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const onPress = () => {
    router.push(`/chat/${channel._id}`);
  };
  return (
    <CustomPressable onPress={onPress}>
      <Avatar size={width / 6} imgSrc={channel.image_url} />
    </CustomPressable>
  );
};
