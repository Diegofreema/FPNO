import { EmptyText } from '@/features/home/components/empty-text';
import { UserType } from '@/types';
import { LegendList } from '@legendapp/list';
import React from 'react';
import { User } from './user';

type Props = {
  users: UserType[];
  total: number;
};

export const Users = ({ total, users }: Props) => {
  return (
    <LegendList
      data={users}
      renderItem={({ item }) => <User user={item} />}
      keyExtractor={(item) => item.$id}
      recycleItems
      contentContainerStyle={{ marginTop: 20 }}
      ListEmptyComponent={() => <EmptyText text="No users found" />}
    />
  );
};
