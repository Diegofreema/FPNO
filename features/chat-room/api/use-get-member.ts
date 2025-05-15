import { useAuth } from '@/lib/zustand/useAuth';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getMember, getPendingMember } from '../server';

type Props = {
  channel_id: string;
};

export const useGetMember = ({ channel_id }: Props) => {
  const userId = useAuth((state) => state.user?.id!);
  return useQuery({
    queryKey: ['member', userId, channel_id],
    queryFn: () => getMember({ channel_id, member_id: userId }),
    placeholderData: keepPreviousData,
  });
};
export const useGetPendingMember = ({ channel_id }: Props) => {
  const userId = useAuth((state) => state.user?.id!);
  return useQuery({
    queryKey: ['pending_member', userId, channel_id],
    queryFn: () => getPendingMember({ channel_id, member_id: userId }),
    placeholderData: keepPreviousData,
  });
};
