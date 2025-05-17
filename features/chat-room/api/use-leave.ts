import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { leaveRoom } from '../server';

export const useLeave = () => {
  const query = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: { roomId: string; memberId: string }) => {
      const res = await leaveRoom(data);
      return res;
    },
    onSuccess: () => {
      toast.success('Successfully left the room');
      query.invalidateQueries({ queryKey: ['member'] });
      query.invalidateQueries({ queryKey: ['members'] });
      query.invalidateQueries({ queryKey: ['room-info'] });
      query.invalidateQueries({ queryKey: ['channels-i-am-in'] });

      router.replace('/chat');

      // ! to add more later
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to leave room');
    },
  });
};
