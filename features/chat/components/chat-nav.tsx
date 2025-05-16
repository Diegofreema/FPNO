import { SubTitle } from '@/components/typography/subtitle';
import { Avatar } from '@/components/ui/avatar';
import { CustomPressable } from '@/components/ui/custom-pressable';
import { colors } from '@/constants';
import { JoinBtn } from '@/features/chat-room/components/join-room-btn';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { ChatMenu } from './chat-menu';

type Props = {
  imageUrl: string;
  name: string;
  subText?: string;
  channelId: string;
  isCreator: boolean;
  isMember: boolean;
  isInPending: boolean;
};

export const ChatNav = ({
  imageUrl,
  name,
  subText,
  channelId,
  isCreator,
  isMember,
  isInPending,
}: Props) => {
  const router = useRouter();
  const onPress = () => {
    router.back();
  };
  const goToRoomInfo = () => {
    router.push(`/chat/room-info?roomId=${channelId}`);
  };
  const handleLeave = () => {};
  const menuItems = [
    { text: 'Room info', onSelect: goToRoomInfo },
    ...(isCreator ? [] : [{ text: 'Leave', onSelect: handleLeave }]),
  ];
  return (
    <View style={styles.container}>
      <CustomPressable onPress={onPress} style={styles.press}>
        <AntDesign name="arrowleft" color={colors.black} size={25} />
        <Animated.View
          sharedTransitionTag="avatar"
          style={{ width: 50, height: 50 }}
        >
          <Avatar imgSrc={imageUrl} size={50} />
        </Animated.View>
        <View>
          <SubTitle
            text={name}
            textStyle={{
              fontFamily: 'NunitoRegular',
              fontSize: RFPercentage(2.2),
              color: colors.black,
            }}
          />
          {subText && (
            <SubTitle
              text={subText}
              textStyle={{
                fontFamily: 'NunitoLight',
                fontSize: RFPercentage(1.5),
                color: colors.gray,
              }}
            />
          )}
        </View>
      </CustomPressable>

      {isMember ? (
        <ChatMenu menuItems={menuItems} />
      ) : (
        <JoinBtn roomId={channelId} isInPending={isInPending} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
    gap: 7,
  },
  press: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});
