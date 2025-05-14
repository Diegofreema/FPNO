import { useQuery } from '@tanstack/react-query';
import { getTopChatRooms } from '../server';

export const useGetTopChatRooms = () => {
  return useQuery({
    queryKey: ['top-chat-rooms'],
    queryFn: getTopChatRooms,
  });
};
