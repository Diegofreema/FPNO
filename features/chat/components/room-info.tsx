import { LoadingModal } from '@/components/typography/loading-modal';
import { useRemoveMember } from '@/features/chat-room/api/use-remove-member';
import { useUpdateMemberRole } from '@/features/chat-room/api/use-update-member-role';
import { ChatRoleDisplay } from '@/features/chat-room/components/role';
import { useAuth } from '@/lib/zustand/useAuth';
import { MemberAccessRole, MemberWithUserProfile } from '@/types';
import { LegendList } from '@legendapp/list';
import React from 'react';
import { Alert, View } from 'react-native';
import { Models } from 'react-native-appwrite';
import { ChatMenu } from './chat-menu';
import { User } from './user';

type Props = {
  infoData: Models.DocumentList<MemberWithUserProfile>;
  handleMore: () => void;
  creatorId: string;
  roomId: string;
  disableAction: boolean;
  loggedInUser: string;
};

export const RoomInfo = ({
  infoData,
  handleMore,
  creatorId,
  roomId,
  disableAction,
  loggedInUser,
}: Props) => {
  const { documents, total } = infoData;
  const hide = documents.length === total;
  const { mutateAsync: removeMember, isPending: isRemoving } =
    useRemoveMember();
  const { mutateAsync: updateMember, isPending: isUpdating } =
    useUpdateMemberRole();
  const actionUserId = useAuth((state) => state.user?.id!);
  const onRemoveUser = async ({ memberId }: { memberId: string }) => {
    Alert.alert('Are you sure?', 'This can not be reversed', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Remove',
        onPress: () => removeMember({ roomId, memberId, actionUserId }),
        style: 'destructive',
      },
    ]);
  };
  const onChangeRole = async (memberId: string) => {
    Alert.alert('Update role', 'This will update the user role', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Update',
        onPress: () => updateMember({ roomId, memberId, actionUserId }),
        style: 'default',
      },
    ]);
  };
  const isVisible = isRemoving || isUpdating;
  return (
    <View style={{ flex: 1 }}>
      <LoadingModal visible={isVisible} />
      <LegendList
        data={documents}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isAdmin = item.access_role === MemberAccessRole.ADMIN;
          const roleText =
            creatorId === item.user.userId
              ? 'owner'
              : isAdmin
              ? 'admin'
              : 'member';
          const disabled = creatorId === item.user.userId;
          const text = isAdmin ? 'Member' : 'Admin';
          return (
            <ChatMenu
              disable={
                disabled || disableAction || item.user.userId === loggedInUser
              }
              trigger={
                <User
                  user={item.user}
                  rightContent={<ChatRoleDisplay role={roleText} />}
                />
              }
              menuItems={[
                {
                  text: 'Remove',
                  onSelect: () => onRemoveUser({ memberId: item.member_id }),
                },
                {
                  text: `Make ${text}`,
                  onSelect: () => onChangeRole(item.member_id),
                },
              ]}
            />
          );
        }}
        keyExtractor={(item) => item.$id}
        ListFooterComponent={() => (
          <ListFooterComponent hide={hide} handleMore={handleMore} />
        )}
        scrollEnabled={false}
        contentContainerStyle={{ gap: 15 }}
        recycleItems
      />
    </View>
  );
};

const ListFooterComponent = ({
  handleMore,
  hide,
}: {
  hide: boolean;
  handleMore: () => void;
}) => {
  return <View></View>;
};
