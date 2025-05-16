import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { CreateChatRoomSchema } from '../schema';
import { editChatRoom } from '../server';

export const useUpdateChatRoom = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateChatRoomSchema & { creatorId: string; channel_id: string }
    ) => {
      const res = await editChatRoom(data);
      return res;
    },
    onSuccess: (data) => {
      toast.success('Chat room updated');
      query.invalidateQueries({ queryKey: ['chat-rooms'] });
      query.invalidateQueries({ queryKey: ['room-info'] });
      query.invalidateQueries({ queryKey: ['top-chat-rooms'] });
      query.invalidateQueries({ queryKey: ['channels-i-am-in'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update chat room');
    },
  });
};
