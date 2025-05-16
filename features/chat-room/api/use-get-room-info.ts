import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getRoomInfo } from '../server';

type Props = {
  channel_id: string;
};

export const useGetRoomInfo = ({ channel_id }: Props) => {
  return useQuery({
    queryKey: ['room-info', channel_id],
    queryFn: () => getRoomInfo({ roomId: channel_id }),
    placeholderData: keepPreviousData,
  });
};
