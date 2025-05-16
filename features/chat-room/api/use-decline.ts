import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { declineRequest } from '../server';

export const useDecline = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (data: { roomId: string; memberId: string }) => {
      const res = await declineRequest(data);
      return res;
    },
    onSuccess: () => {
      toast.success('Request declined');

      query.invalidateQueries({ queryKey: ['pending_member'] });
      query.invalidateQueries({ queryKey: ['pending_members'] });

      // ! to add more later
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to decline request');
    },
  });
};
