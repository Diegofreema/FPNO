import { useAuth } from '@/lib/zustand/useAuth';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { exploreRooms } from '../server';

type Props = {
  search?: string;
  more: number;
};

export const useExploreRooms = ({ more, search }: Props) => {
  const userId = useAuth((state) => state.user?.id!);
  return useQuery({
    queryKey: ['explore-rooms', userId, search, more],
    queryFn: () => exploreRooms({ search, creatorId: userId, more }),
    placeholderData: keepPreviousData,
  });
};
