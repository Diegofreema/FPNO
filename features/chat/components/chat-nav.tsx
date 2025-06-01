import {SubTitle} from '@/components/typography/subtitle';
import {Avatar} from '@/components/ui/avatar';
import {CustomPressable} from '@/components/ui/custom-pressable';
import {colors} from '@/constants';
import {JoinBtn} from '@/features/chat-room/components/join-room-btn';
import {useSelected} from '@/features/chat-room/hook/use-selected';
import {useAuth} from '@/lib/zustand/useAuth';
import {AntDesign} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {Trash} from 'lucide-react-native';
import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {useDeleteMessages} from '../api/use-delete-messages';
import {Menu} from "@/components/dropdown-menu";


type Props = {
  imageUrl: string;
  name: string;
  subText?: string;
  channelId: string;
  isCreator: boolean;
  isMember: boolean;
  isInPending: boolean;

  leaveRoom: () => Promise<void>;
};

export const ChatNav = ({
  imageUrl,
  name,
  subText,
  channelId,
  isCreator,
  isMember,
  isInPending,

  leaveRoom,
}: Props) => {
  const router = useRouter();
  const selectedMessages = useSelected((state) => state.selected);



  const clearMessages = useSelected((state) => state.clear);
  const messageIsSelected = selectedMessages.length > 0;
  const selectedMessageLength = selectedMessages.length;
  const { mutateAsync, isPending } = useDeleteMessages();
  const loggedInUser = useAuth((state) => state.user?.id!);
  const onHandleDelete = async () => {
    await mutateAsync(
      {
        messageIds: selectedMessages.map((m) => m.messageId),
        userId: loggedInUser,
      },
      {
        onSuccess: () => {
          clearMessages();
        },
      }
    );
  };

  const onPress = () => {
    router.back();
  };
  const goToRoomInfo = () => {
    router.push(`/chat/room-info?roomId=${channelId}`);
  };

  const menuItems = [
    { text: 'Room info', onSelect: goToRoomInfo },
    ...(isCreator
      ? []
      : [{ text: 'Leave', onSelect: () => onLeaveRoom(leaveRoom) }]),
  ];

  return (
    <>
      <View style={styles.container}>
        <CustomPressable onPress={onPress} style={styles.press}>
          <AntDesign name="arrowleft" color={colors.black} size={25} />
          {selectedMessageLength > 0 ? (
            <SubTitle
              text={`${selectedMessageLength}`}
              textStyle={{
                fontFamily: 'NunitoRegular',
                fontSize: RFPercentage(2.2),
                color: colors.black,
                flex: 0,
              }}
            />
          ) : (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <View style={{ width: 50, height: 50 }}>
                <Avatar imgSrc={imageUrl} size={50} />
              </View>
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
            </View>
          )}
        </CustomPressable>

        {isMember ? (
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {messageIsSelected && (
              <CustomPressable
                disabled={isPending}
                onPress={() => onDeleteMessages(onHandleDelete)}
              >
                <Trash />
              </CustomPressable>
            )}
            <Menu menuOptions={menuItems} />
          </View>
        ) : (
          <JoinBtn roomId={channelId} isInPending={isInPending} />
        )}
      </View>
      {/* <LoadingModal visible={isLeaving} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
    gap: 7,
    minHeight: 50,
  },
  press: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});

const onDeleteMessages = async (onHandleDelete: () => Promise<void>) => {
  Alert.alert('Are you sure?', 'This can not be reversed!!!', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'Delete',
      onPress: () => onHandleDelete(),
      style: 'destructive',
    },
  ]);
};

const onLeaveRoom = async (leaveRoom: () => Promise<void>) => {
  Alert.alert('Are you sure?', 'This can not be reversed!!!', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'Leave',
      onPress: leaveRoom,
      style: 'destructive',
    },
  ]);
};
