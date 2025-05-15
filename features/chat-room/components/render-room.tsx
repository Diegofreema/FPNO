import { Avatar } from '@/components/ui/avatar';
import { CustomPressable } from '@/components/ui/custom-pressable';
import { HStack } from '@/components/ui/h-stack';
import { colors } from '@/constants';
import { formatNumber, trimText } from '@/helper';
import { useAuth } from '@/lib/zustand/useAuth';
import { ChannelTypeWithPendingMembers } from '@/types';
import { router, usePathname } from 'expo-router';
import { Text, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { OuterRight } from './outer-right';

type Props = {
  room: ChannelTypeWithPendingMembers;
};

export const RenderRoom = ({ room }: Props) => {
  const userId = useAuth((state) => state.user?.id!);
  const isMember = room.members.some((member) => member === userId);
  const isInPending = room?.pendingMembers?.some(
    (member) => member.member_to_join === userId
  );
  const membersCount = room.members.length;
  const pathname = usePathname();
  const disabled = pathname === '/explore';
  const onPress = () => {
    router.push(`/chat/${room.$id}`);
  };
  return (
    <CustomPressable disabled={disabled} onPress={onPress}>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        gap={10}
        leftContent={() => (
          <Left
            image={room.image_url}
            isMember={isMember}
            membersCount={membersCount}
            name={room.channel_name}
            lastMessage={trimText(room.last_message, 40)}
          />
        )}
        rightContent={() => (
          <OuterRight
            isMember={isMember}
            roomId={room.$id}
            isInPending={isInPending || false}
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

type LeftProps = {
  name: string;
  lastMessage?: string;
  isMember: boolean;
  membersCount: number;
  image: string;
};
const Left = ({
  image,
  isMember,
  membersCount,
  name,
  lastMessage,
}: LeftProps) => {
  return (
    <HStack
      justifyContent="flex-start"
      alignItems="center"
      style={{ flex: 1 }}
      gap={10}
      leftContent={() => <Avatar imgSrc={image} size={50} />}
      rightContent={() => (
        <Right
          name={name}
          lastMessage={lastMessage}
          isMember={isMember}
          membersCount={membersCount}
        />
      )}
    />
  );
};

const Right = ({ name, lastMessage, isMember, membersCount }: RightProps) => {
  const textToDisplay = isMember
    ? lastMessage
    : `${formatNumber(membersCount)} ${
        membersCount > 1 ? 'members' : 'member'
      }`;

  console.log({ lastMessage });

  return (
    <View style={{ flex: 1 }}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          fontSize: RFPercentage(1.6),
          fontWeight: 'bold',
          lineHeight: RFPercentage(1.8),
        }}
      >
        {name}
      </Text>

      <Text
        style={{
          fontSize: RFPercentage(1.4),
          color: colors.textGray,
        }}
      >
        {textToDisplay}
      </Text>
    </View>
  );
};
