import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { acceptRequest } from '../server';

export const useAccept = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (data: { roomId: string; memberId: string }) => {
      const res = await acceptRequest(data);
      return res;
    },
    onSuccess: () => {
      toast.success('Request accepted');
      query.invalidateQueries({ queryKey: ['pending_member'] });
      query.invalidateQueries({ queryKey: ['pending_members'] });
      query.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to accept request');
    },
  });
};
