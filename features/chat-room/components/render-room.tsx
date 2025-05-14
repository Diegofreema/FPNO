import { Avatar } from '@/components/ui/avatar';
import { CustomPressable } from '@/components/ui/custom-pressable';
import { HStack } from '@/components/ui/h-stack';
import { colors } from '@/constants';
import { useAuth } from '@/lib/zustand/useAuth';
import { ChannelType } from '@/types';
import { Text, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

type Props = {
  room: ChannelType;
};

export const RenderRoom = ({ room }: Props) => {
  const userId = useAuth((state) => state.user?.id!);
  const isMember = room.members.some((member) => member === userId);
  const membersCount = room.members.length;
  return (
    <CustomPressable>
      <HStack
        justifyContent="flex-start"
        alignItems="center"
        gap={10}
        leftContent={() => <Avatar imgSrc={room.image_url} size={50} />}
        rightContent={() => (
          <Right
            name={room.channel_name}
            lastMessage={room?.last_message}
            isMember={isMember}
            membersCount={membersCount}
          />
        )}
      />
    </CustomPressable>
  );
};

type RightProps = {
  name: string;
  lastMessage?: string;
  isMember: boolean;
  membersCount: number;
};
const Right = ({ name, lastMessage }: RightProps) => {
  return (
    <View style={{ gap: 5 }}>
      <Text style={{ fontSize: RFPercentage(1.6), fontWeight: 'bold' }}>
        {name}
      </Text>
      {lastMessage && (
        <Text style={{ fontSize: RFPercentage(1.4), color: colors.textGray }}>
          {lastMessage}
        </Text>
      )}
    </View>
  );
};
