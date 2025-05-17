import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { updateMemberRole } from '../server';

export const useUpdateMemberRole = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      roomId: string;
      memberId: string;
      actionUserId: string;
    }) => {
      const res = await updateMemberRole(data);
      return res;
    },
    onSuccess: () => {
      toast.success('Member role updated');

      query.invalidateQueries({ queryKey: ['member'] });
      query.invalidateQueries({ queryKey: ['members'] });

      // ! to add more later
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update member role');
    },
  });
};
