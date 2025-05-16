import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { JoinType } from '../schema';
import { joinRoom } from '../server';

export const useJoinGroup = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (data: JoinType) => {
      const res = await joinRoom(data);
      return res;
    },
    onSuccess: () => {
      toast.success('Your request has been sent');
      query.invalidateQueries({ queryKey: ['chat-rooms'] });
      query.invalidateQueries({ queryKey: ['channels-i-am-in'] });
      query.invalidateQueries({ queryKey: ['pending_member'] });
      query.invalidateQueries({ queryKey: ['member'] });
      query.invalidateQueries({ queryKey: ['explore-rooms'] });

      // ! to add more later
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send join request');
    },
  });
};
