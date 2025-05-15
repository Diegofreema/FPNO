import { Text, View } from 'react-native';
import { JoinBtn } from './join-room-btn';

type OuterRightProps = {
  isMember: boolean;
  roomId: string;
};
export const OuterRight = ({ isMember, roomId }: OuterRightProps) => {
  if (isMember) {
    return (
      <View>
        <Text>ddfdf</Text>
      </View>
    );
  }

  return <JoinBtn roomId={roomId} />;
};
