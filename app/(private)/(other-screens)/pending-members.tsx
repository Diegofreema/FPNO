import { ErrorComponent } from '@/components/ui/error-component';
import { Loading } from '@/components/ui/loading';
import { NavHeader } from '@/components/ui/nav-header';
import { Wrapper } from '@/components/ui/wrapper';
import { useGetPendingMembers } from '@/features/chat-room/api/use-get-members';
import { PendingMembers } from '@/features/chat/components/pending-members';

import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

const PendingMembersScreen = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [more, setMore] = useState(0);
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isRefetchError,
    isRefetching,
  } = useGetPendingMembers({ channel_id: roomId, more });

  if (isError || isRefetchError) {
    return <ErrorComponent onPress={refetch} title={error.message} />;
  }

  if (isPending) {
    return <Loading />;
  }

  const handleMore = () => {
    if (data.documents.length >= data.total) return;
    setMore((prev) => prev + 10);
  };
  return (
    <Wrapper>
      <NavHeader title="Pending members" />
      <PendingMembers
        users={data.documents}
        handleMore={handleMore}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </Wrapper>
  );
};

export default PendingMembersScreen;
