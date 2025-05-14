import { useAuth } from '@/lib/zustand/useAuth';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getChannelsIamIn } from '../server';

type Props = {
  search?: string;
  more: number;
};

export const useGetChannelIAmIn = ({ more, search }: Props) => {
  const userId = useAuth((state) => state.user?.id!);
  return useQuery({
    queryKey: ['channels-i-am-in', userId, search, more],
    queryFn: () => getChannelsIamIn({ search, userId, more }),
    placeholderData: keepPreviousData,
  });
};
