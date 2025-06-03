import {Loading} from "@/components/ui/loading";
import {NavHeader} from "@/components/ui/nav-header";
import {ScrollWrapper} from "@/components/ui/wrapper";
import {PendingMemberBanner} from "@/features/chat-room/components/pending-member-banner";
import {RoomInfo} from "@/features/chat/components/room-info";
import {RoomInfoTop} from "@/features/chat/components/room-info-top";
import {useAuth} from "@/lib/zustand/useAuth";
import {Redirect, useLocalSearchParams, useRouter} from "expo-router";
import React from "react";
import {Menu} from "@/components/dropdown-menu";
import {usePaginatedQuery, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {toast} from "sonner-native";

const RoomInfoScreen = () => {
  const { roomId } = useLocalSearchParams<{ roomId: Id<"rooms"> }>();

  const id = useAuth((state) => state.user?.convexId!);
  const room = useQuery(api.room.room, { room_id: roomId });
  const membersData = usePaginatedQuery(
    api.room.getRoomMembers,
    { room_id: roomId, status: "ACCEPTED" },
    { initialNumItems: 30 },
  );
  const pendingMemberCount = useQuery(api.room.getRoomPendingMembersCount, {
    room_id: roomId,
  });
  const isMember = useQuery(api.room.isMember, {room_id: roomId,member_id: id})

  const router = useRouter();

  const { status, isLoading, loadMore, results } = membersData;

  const isPending = room === undefined || pendingMemberCount === undefined || isMember === undefined;

  if (isPending) {
    return <Loading />;
  }
  if (room === null) {
    toast("Room does not exist!!!");
    return <Redirect href="/chat" />;
  }
  if(!isMember) {
    toast("You are not a member of this room!!!");
    return <Redirect href="/chat" />;
  }

  const onSelect = () => {
    router.push(`/chat/edit?roomId=${roomId}`);
  };
  const handleMore = () => {
    if (status === "CanLoadMore" && !isLoading) {
      loadMore(50);
    }
  };

  const isCreator = room.creator_id === id;

  const isLoggedInUserAdmin = room.adminMembers.includes(id!);

  const showBanner = isCreator || isLoggedInUserAdmin;
  return (
    <ScrollWrapper>
      <NavHeader
        title=""
        leftContent={() =>
          isCreator ? (
            <Menu menuOptions={[{ onSelect: onSelect, text: "Edit" }]} />
          ) : null
        }
      />
      {showBanner && (
        <PendingMemberBanner
          pendingMemberCount={pendingMemberCount}
          roomId={roomId}
        />
      )}
      <RoomInfoTop data={room} />
      <RoomInfo
        infoData={results}
        handleMore={handleMore}
        creatorId={room.creator_id}
        roomId={roomId}
        loggedInUser={id!}
        disableAction={!isLoggedInUserAdmin && !isCreator}
        show={status === "CanLoadMore"}
      />
    </ScrollWrapper>
  );
};

export default RoomInfoScreen;
