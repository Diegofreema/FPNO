import {SendMessageType} from '@/types';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner-native';
import {sendMessage} from '../server';

export const useSendMessage = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendMessageType) => {
      return await sendMessage(data);

    },
    onSuccess: () => {
     void query.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error) => {
      console.log({myError: error})
      toast.error(error.message || 'Failed to send message');
    },
  });
};
