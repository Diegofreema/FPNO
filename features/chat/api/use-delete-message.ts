import { deleteMessage } from '@/features/chat-room/server';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';

export const useDeleteMessage = () => {
  return useMutation({
    mutationFn: async (data: { messageId: string; userId: string }) => {
      const res = await deleteMessage(data);
      return res;
    },
    onSuccess: () => {
      toast.success('Message deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete message');
    },
  });
};
