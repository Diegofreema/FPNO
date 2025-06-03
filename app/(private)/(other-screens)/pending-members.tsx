import {Loading} from '@/components/ui/loading';
import {NavHeader} from '@/components/ui/nav-header';
import {Wrapper} from '@/components/ui/wrapper';
import {PendingMembers} from '@/features/chat/components/pending-members';

import {useLocalSearchParams} from 'expo-router';
import React from 'react';
import {usePaginatedQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

const PendingMembersScreen = () => {
  const { roomId } = useLocalSearchParams<{ roomId: Id<'rooms'> }>();

  const pendingMembersData = usePaginatedQuery(api.room.getRoomMembers, {room_id: roomId, status: "PENDING"}, { initialNumItems: 30})

const {isLoading,loadMore,status,results} = pendingMembersData;
  if (results === undefined) {
    return <Loading />;
  }

  const handleMore = () => {
   if(status === "CanLoadMore" && !isLoading){
      loadMore(20)
    }
  };
  return (
    <Wrapper>
      <NavHeader title="Pending members" />
      <PendingMembers
        users={results}
        handleMore={handleMore}
        roomId={roomId}
      />
    </Wrapper>
  );
};

export default PendingMembersScreen;
