import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchOtherUsers } from '../server';

type Props = {
  userId: string;
  query?: string;
};

export const useGetOtherUsers = ({ userId, query }: Props) => {
  return useQuery({
    queryKey: ['other-users', userId, query],
    queryFn: () => fetchOtherUsers({ userId, query }),
    placeholderData: keepPreviousData,
  });
};
