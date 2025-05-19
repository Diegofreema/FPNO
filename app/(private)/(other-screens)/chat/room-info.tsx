import { ErrorComponent } from '@/components/ui/error-component';
import { Loading } from '@/components/ui/loading';
import { NavHeader } from '@/components/ui/nav-header';
import { ScrollWrapper } from '@/components/ui/wrapper';
import {
  useGetMembers,
  useGetPendingMembers,
} from '@/features/chat-room/api/use-get-members';
import { useGetRoomInfo } from '@/features/chat-room/api/use-get-room-info';
import { PendingMemberBanner } from '@/features/chat-room/components/pending-member-banner';
import { ChatMenu } from '@/features/chat/components/chat-menu';
import { RoomInfo } from '@/features/chat/components/room-info';
import { RoomInfoTop } from '@/features/chat/components/room-info-top';
import { useAuth } from '@/lib/zustand/useAuth';
import { MemberAccessRole } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';

const RoomInfoScreen = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [more, setMore] = useState(0);
  const id = useAuth((state) => state.user?.id);

  const {
    data,
    isPending: isPendingData,
    isError: isDataError,
    error,

    isRefetchError,
    refetch,
  } = useGetRoomInfo({ channel_id: roomId });
  const {
    data: memberData,
    error: memberError,
    isPending: isPendingMember,
    isError: isMemberError,
    isRefetchError: isMemberRefetchError,
    refetch: refetchMember,
  } = useGetMembers({
    channel_id: roomId,
    more,
  });
  const {
    data: pendingMemberData,
    error: pendingMemberError,
    isPending: isPendingPendingMember,
    isError: isPendingMemberError,
    isRefetchError: isPendingMemberRefetchError,
    refetch: refetchPendingMember,
  } = useGetPendingMembers({
    channel_id: roomId,
    more,
  });
  const router = useRouter();

  const errorMessage =
    error?.message || memberError?.message || pendingMemberError?.message;
  const isError =
    isDataError ||
    isRefetchError ||
    isMemberError ||
    isMemberRefetchError ||
    isPendingMemberError ||
    isPendingMemberRefetchError;
  const isPending = isPendingData || isPendingMember || isPendingPendingMember;
  const handleRefetch = () => {
    refetch();
    refetchMember();
    refetchPendingMember();
  };
  if (isError) {
    return <ErrorComponent onPress={handleRefetch} title={errorMessage} />;
  }
  if (isPending) {
    return <Loading />;
  }

  const onSelect = () => {
    router.push(`/chat/edit?roomId=${roomId}`);
  };
  const handleMore = () => {
    if (memberData.documents.length < memberData.total) {
      return;
    }
    setMore((state) => state + 10);
  };

  const isCreator = data.creator_id === id;
  const loggedInMember = memberData.documents.find(
    (member) => member.member_id === id
  );

  const isLoggedInUserAdmin = !!(
    loggedInMember && loggedInMember.access_role === MemberAccessRole.ADMIN
  );
  const { total } = pendingMemberData;
  console.log(total);
  const showBanner = isCreator || isLoggedInUserAdmin;
  return (
    <ScrollWrapper>
      <NavHeader
        title=""
        leftContent={() =>
          isCreator ? (
            <ChatMenu menuItems={[{ onSelect: onSelect, text: 'Edit' }]} />
          ) : null
        }
      />
      {showBanner && (
        <PendingMemberBanner pendingMemberCount={total} roomId={roomId} />
      )}
      <RoomInfoTop data={data} />
      <RoomInfo
        infoData={memberData}
        handleMore={handleMore}
        creatorId={data.creator_id}
        roomId={roomId}
        loggedInUser={id!}
        disableAction={!isLoggedInUserAdmin && !isCreator}
      />
    </ScrollWrapper>
  );
};

export default RoomInfoScreen;
