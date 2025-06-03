import {Loading} from "@/components/ui/loading";
import {EmptyText} from "@/features/home/components/empty-text";
import {UserType} from "@/types";
import {LegendList} from "@legendapp/list";
import React from "react";
import {User} from "./user";

type Props = {
  users: UserType[];
  total: number;
  onEndReached: () => void;
};

export const Users = ({ total, users, onEndReached }: Props) => {
  return (
    <LegendList
      data={users}
      // @ts-ignore
      renderItem={({ item }) => <User user={item} />}
      keyExtractor={(item) => item.$id}
      recycleItems
      ListEmptyComponent={() => <EmptyText text="No users found" />}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => (total > users.length ? <Loading /> : null)}
    />
  );
};
