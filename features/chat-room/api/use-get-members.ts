import { MemberStatus } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getMembers } from '../server';

type Props = {
  channel_id: string;
  status: MemberStatus;
  more: number;
};

export const useGetMembers = ({ channel_id, status, more }: Props) => {
  return useQuery({
    queryKey: ['members', status, channel_id, more],
    queryFn: () => getMembers({ channel_id, status, more }),
    placeholderData: keepPreviousData,
  });
};
