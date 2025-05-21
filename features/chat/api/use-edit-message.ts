import { editMessage } from '@/features/chat-room/server';
import { ServerEdit } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';

export const useEditMessage = () => {
  return useMutation({
    mutationFn: async (data: ServerEdit) => {
      const res = await editMessage(data);
      return res;
    },
    onSuccess: () => {
      toast.success('Message edited');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to edit message');
    },
  });
};
