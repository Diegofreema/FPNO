import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { CreateChatRoomSchema } from '../schema';
import { createChatRoom } from '../server';

export const useCreateChatRoom = () => {
  const query = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: CreateChatRoomSchema & { creatorId: string }) => {
      const res = await createChatRoom(data);
      return res;
    },
    onSuccess: (data) => {
      toast.success('Chat room created');
      query.invalidateQueries({ queryKey: ['chat-rooms'] });
      query.invalidateQueries({ queryKey: ['top-chat-rooms'] });
      router.replace(`/chat/${data.$id}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create chat room');
    },
  });
};
