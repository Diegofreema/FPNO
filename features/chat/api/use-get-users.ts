import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchOtherUsers } from '../server';

type Props = {
  userId: string;
  offSet: number;
  query?: string;
};

export const useGetOtherUsers = ({ userId, query, offSet }: Props) => {
  return useQuery({
    queryKey: ['other-users', userId, query],
    queryFn: () => fetchOtherUsers({ userId, query, offSet }),
    placeholderData: keepPreviousData,
  });
};
