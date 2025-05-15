import { useAuth } from '@/lib/zustand/useAuth';

export const useIsCreator = ({ creatorId }: { creatorId?: string }) => {
  const id = useAuth((state) => state.user?.id);

  return id === creatorId;
};
