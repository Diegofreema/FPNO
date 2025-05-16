import { ErrorComponent } from '@/components/ui/error-component';
import { Loading } from '@/components/ui/loading';
import { NavHeader } from '@/components/ui/nav-header';
import { Wrapper } from '@/components/ui/wrapper';
import { useGetMembers } from '@/features/chat-room/api/use-get-members';
import { useGetRoomInfo } from '@/features/chat-room/api/use-get-room-info';
import { ChatMenu } from '@/features/chat/components/chat-menu';
import { RoomInfo } from '@/features/chat/components/room-info';
import { useAuth } from '@/lib/zustand/useAuth';
import { MemberStatus } from '@/types';
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
    isRefetching,
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
    isRefetching: isMemberRefetching,
  } = useGetMembers({
    channel_id: roomId,
    more,
    status: MemberStatus.ACCEPTED,
  });
  const router = useRouter();

  const errorMessage = error?.message || memberError?.message;
  const isError =
    isDataError || isRefetchError || isMemberError || isMemberRefetchError;
  const isPending = isPendingData || isPendingMember;
  const handleRefetch = () => {
    refetch();
    refetchMember();
  };
  if (isError) {
    return <ErrorComponent onPress={handleRefetch} title={errorMessage} />;
  }
  if (isPending) {
    return <Loading />;
  }

  const onRefetching = isRefetching || isMemberRefetching;
  const onSelect = () => {
    router.push(`/chat/edit?roomId=${roomId}`);
  };
  const handleMore = () => {
    if (memberData.documents.length < memberData.total) {
      return;
    }
    setMore((state) => state + 10);
  };
  const infoData = [{ data, memberData }];
  console.log({ memberData });
  const isCreator = data.creator_id === id;

  return (
    <Wrapper>
      <NavHeader
        title=""
        leftContent={() =>
          isCreator ? (
            <ChatMenu menuItems={[{ onSelect: onSelect, text: 'Edit' }]} />
          ) : null
        }
      />
      <RoomInfo
        infoData={infoData}
        handleMore={handleMore}
        onRefresh={handleRefetch}
        refreshing={onRefetching}
      />
    </Wrapper>
  );
};

export default RoomInfoScreen;
