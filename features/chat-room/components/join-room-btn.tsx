import { CustomPressable } from '@/components/ui/custom-pressable';
import { colors } from '@/constants';
import { useAuth } from '@/lib/zustand/useAuth';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useJoinGroup } from '../api/use-join-group';

type Props = {
  roomId: string;
  isInPending: boolean;
};

export const JoinBtn = ({ roomId, isInPending }: Props) => {
  const userId = useAuth((state) => state.user?.id!);
  const { mutateAsync, isPending } = useJoinGroup();
  const onPress = async () => {
    await mutateAsync({ channel_id: roomId, member_to_join: userId });
  };
  const text = isInPending ? 'Pending' : 'Join';
  return (
    <CustomPressable
      style={styles.followBtn}
      disabled={isPending || isInPending}
      onPress={onPress}
    >
      <Text style={styles.followText}>{text}</Text>
    </CustomPressable>
  );
};

const styles = StyleSheet.create({
  followBtn: {
    borderRadius: 15,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.lightblue,
  },
  followText: {
    color: colors.white,
  },
});
