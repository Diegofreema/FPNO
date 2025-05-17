import { ChatRoleDisplay } from '@/features/chat-room/components/role';
import { MemberAccessRole, MemberWithUserProfile } from '@/types';
import { LegendList } from '@legendapp/list';
import React from 'react';
import { View } from 'react-native';
import { Models } from 'react-native-appwrite';
import { ChatMenu } from './chat-menu';
import { User } from './user';

type Props = {
  infoData: Models.DocumentList<MemberWithUserProfile>;
  handleMore: () => void;
  creatorId: string;
};

export const RoomInfo = ({ infoData, handleMore, creatorId }: Props) => {
  const { documents, total } = infoData;
  const hide = documents.length === total;
  const onRemoveUser = async () => {};
  const onChangeRole = async () => {};
  return (
    <View style={{ flex: 1 }}>
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
              disable={disabled}
              trigger={
                <User
                  user={item.user}
                  rightContent={<ChatRoleDisplay role={roleText} />}
                />
              }
              menuItems={[
                { text: 'Remove', onSelect: () => {} },
                { text: `Make ${text}`, onSelect: () => {} },
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
