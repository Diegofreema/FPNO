import { ErrorComponent } from '@/components/ui/error-component';
import { Loading } from '@/components/ui/loading';
import { NavHeader } from '@/components/ui/nav-header';
import { Wrapper } from '@/components/ui/wrapper';
import { useGetRoomInfo } from '@/features/chat-room/api/use-get-room-info';
import { EditRoom } from '@/features/chat/components/edit-room';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const EditScreen = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { data, isPending, isError, error, refetch } = useGetRoomInfo({
    channel_id: roomId,
  });
  if (isError) {
    return <ErrorComponent onPress={refetch} title={error.message} />;
  }

  if (isPending) {
    return <Loading />;
  }
  return (
    <Wrapper>
      <NavHeader title="Edit room" />
      <EditRoom initialData={data} />
    </Wrapper>
  );
};

export default EditScreen;
