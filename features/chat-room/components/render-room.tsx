import { ChatLoader } from '@/components/skeletons/chat-loader';
import { Avatar } from '@/components/ui/avatar';
import { CustomPressable } from '@/components/ui/custom-pressable';
import { HStack } from '@/components/ui/h-stack';
import { colors } from '@/constants';
import { checkIfIsInPending, formatNumber, trimText } from '@/helper';
import { useAuth } from '@/lib/zustand/useAuth';
import { ChannelTypeWithPendingMembers } from '@/types';
import { router, usePathname } from 'expo-router';
import { File } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useGetMember } from '../api/use-get-member';
import { OuterRight } from './outer-right';

type Props = {
  room: ChannelTypeWithPendingMembers;
};

export const RenderRoom = ({ room }: Props) => {
  const userId = useAuth((state) => state.user?.id!);
  const {
    data: member,
    isPending: isPendingMember,
    isError: isErrorMember,
  } = useGetMember({ channel_id: room.$id });
  const pathname = usePathname();
  const isMember = !!member?.total;
  const isInPending = checkIfIsInPending(room?.pendingMembers, userId);
  const membersCount = room.members_count;
  const disabled = pathname === '/explore';
  if (isErrorMember) {
    throw new Error('Failed to get data');
  }

  if (isPendingMember) {
    return <ChatLoader length={1} />;
  }
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
            lastMessageTime={room.last_message_time}
          />
        )}
        rightContent={() => (
          <OuterRight
            isMember={isMember}
            roomId={room.$id}
            isInPending={isInPending || false}
            lastMessageTime={room.last_message_time}
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
  lastMessageTime: string;
};

type LeftProps = {
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
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
  lastMessageTime,
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
          lastMessageTime={lastMessageTime!}
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

  return (
    <View style={{ flex: 1 }}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          fontSize: RFPercentage(1.6),
          fontWeight: 'bold',
          lineHeight: RFPercentage(1.8),
          color: colors.black,
        }}
      >
        {name}
      </Text>

      {lastMessage === 'file' ? (
        <File color={colors.textGray} size={20} />
      ) : (
        <Text
          style={{
            fontSize: RFPercentage(1.4),
            color: colors.textGray,
          }}
        >
          {textToDisplay}
        </Text>
      )}
    </View>
  );
};
