import { Text, View } from 'react-native';
import { JoinBtn } from './join-room-btn';

type OuterRightProps = {
  isMember: boolean;
  roomId: string;
  isInPending: boolean;
};
export const OuterRight = ({
  isMember,
  roomId,
  isInPending,
}: OuterRightProps) => {
  if (isMember) {
    return (
      <View>
        <Text>ddfdf</Text>
      </View>
    );
  }

  return <JoinBtn roomId={roomId} isInPending={isInPending} />;
};
