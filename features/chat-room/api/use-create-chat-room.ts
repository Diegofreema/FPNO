import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { CreateChatRoomSchema } from '../schema';
import { createChatRoom } from '../server';

export const useCreateChatRoom = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateChatRoomSchema & { creatorId: string }) => {
      const res = await createChatRoom(data);
      return res;
    },
    onSuccess: () => {
      toast.success('Chat room created');
      query.invalidateQueries({ queryKey: ['chat-rooms'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create chat room');
    },
  });
};
