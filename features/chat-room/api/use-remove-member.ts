import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { removeMember } from '../server';

export const useRemoveMember = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      roomId: string;
      memberId: string;
      actionUserId: string;
    }) => {
      const res = await removeMember(data);
      return res;
    },
    onSuccess: () => {
      toast.success('Removed user');

      query.invalidateQueries({ queryKey: ['member'] });
      query.invalidateQueries({ queryKey: ['members'] });

      // ! to add more later
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to remove user');
    },
  });
};
