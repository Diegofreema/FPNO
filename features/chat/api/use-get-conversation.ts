import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getConversationWithMessages } from '../server';

type Props = {
  roomId: string;
  offSet: number;
};

export const useGetConversationWithMessages = ({ roomId, offSet }: Props) => {
  return useQuery({
    queryKey: ['channel', roomId],
    queryFn: () => getConversationWithMessages({ roomId }),
    placeholderData: keepPreviousData,
  });
};
