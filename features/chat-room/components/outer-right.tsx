import {formatMessageTime} from '@/helper';
import {Text, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {JoinBtn} from './join-room-btn';
import {colors} from "@/constants";

type OuterRightProps = {
  isMember: boolean;
  roomId: string;
  isInPending: boolean;
  lastMessageTime: number;
};
export const OuterRight = ({
  isMember,
  roomId,
  isInPending,
  lastMessageTime,
}: OuterRightProps) => {
  if (isMember) {
    return (
      <View>
        <Text
          style={{ fontSize: RFPercentage(1.3), fontFamily: 'NunitoLight', color: colors.black }}
        >
          {formatMessageTime(new Date(lastMessageTime))}
        </Text>
      </View>
    );
  }

  return <JoinBtn roomId={roomId} isInPending={isInPending} />;
};
