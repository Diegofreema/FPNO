import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getMessages } from '../server';

type Props = {
  channel_id: string;

  more: number;
};

export const useGetMessages = ({ more, channel_id }: Props) => {
  return useQuery({
    queryKey: ['messages', more, channel_id],
    queryFn: () => getMessages({ channel_id, more }),
    placeholderData: keepPreviousData,
  });
};
