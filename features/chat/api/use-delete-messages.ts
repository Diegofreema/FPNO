import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { deleteMessages } from '../server';

export const useDeleteMessages = () => {
  return useMutation({
    mutationFn: async ({
      messageIds,
      userId,
    }: {
      messageIds: string[];
      userId: string;
    }) => {
      const res = await deleteMessages(messageIds, userId);
      return res;
    },
    onSuccess: () => {
      toast.success('Messages deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete messages');
    },
  });
};
