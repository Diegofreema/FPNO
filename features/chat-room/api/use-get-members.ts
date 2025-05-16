import { MemberStatus } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getMembers } from '../server';

type Props = {
  channel_id: string;

  more: number;
};

export const useGetMembers = ({ channel_id, more }: Props) => {
  return useQuery({
    queryKey: ['members', channel_id, more],
    queryFn: () =>
      getMembers({ channel_id, status: MemberStatus.ACCEPTED, more }),
    placeholderData: keepPreviousData,
  });
};
export const useGetPendingMembers = ({ channel_id, more }: Props) => {
  return useQuery({
    queryKey: ['pending_members', channel_id, more],
    queryFn: () =>
      getMembers({ channel_id, status: MemberStatus.PENDING, more }),
    placeholderData: keepPreviousData,
  });
};
