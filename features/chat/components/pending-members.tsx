import { MemberWithUserProfile } from '@/types';
import { LegendList } from '@legendapp/list';
import React from 'react';
import { View } from 'react-native';
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
        renderItem={({ item }) => <User user={item.user} />}
        contentContainerStyle={{ gap: 15 }}
      />
    </View>
  );
};
