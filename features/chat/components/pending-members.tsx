import { MemberWithUserProfile } from '@/types';
import { LegendList } from '@legendapp/list';
import React from 'react';
import { View } from 'react-native';
import { ChatMenu } from './chat-menu';
import { User } from './user';

type Props = {
  users: MemberWithUserProfile[];
  handleMore: () => void;
  onRefresh: () => void;
  refreshing: boolean;
};

export const PendingMembers = ({
  users,
  handleMore,
  onRefresh,
  refreshing,
}: Props) => {
  const accept = async (memberId: string) => {};
  const decline = async (memberId: string) => {};
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={users}
        keyExtractor={(item) => item.$id}
        recycleItems
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={handleMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <User
            user={item.user}
            rightContent={
              <ChatMenu
                menuItems={[
                  { text: 'Accept', onSelect: () => accept(item.member_id) },
                  { text: 'Decline', onSelect: () => decline(item.member_id) },
                ]}
              />
            }
          />
        )}
        contentContainerStyle={{ gap: 15 }}
      />
    </View>
  );
};
