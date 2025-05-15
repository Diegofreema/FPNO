import { Avatar } from '@/components/ui/avatar';
import { CustomPressable } from '@/components/ui/custom-pressable';
import { HStack } from '@/components/ui/h-stack';
import { colors } from '@/constants';
import { formatNumber } from '@/helper';
import { useAuth } from '@/lib/zustand/useAuth';
import { ChannelType } from '@/types';
import { StyleSheet, Text, View } from 'react-native';
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
        justifyContent="space-between"
        alignItems="center"
        gap={10}
        leftContent={() => (
          <Left
            image={room.image_url}
            isMember={isMember}
            membersCount={membersCount}
            name={room.channel_name}
          />
        )}
        rightContent={() => <OuterRight isMember={isMember} />}
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
    : `${formatNumber(membersCount)} member(s)`;

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

type OuterRightProps = {
  isMember: boolean;
};

const OuterRight = ({ isMember }: OuterRightProps) => {
  if (isMember) {
    return (
      <View>
        <Text>ddfdf</Text>
      </View>
    );
  }

  return (
    <CustomPressable style={styles.followBtn}>
      <Text style={styles.followText}>Join</Text>
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
