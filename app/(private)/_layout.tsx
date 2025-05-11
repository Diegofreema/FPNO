import { useAuth } from '@/lib/zustand/useAuth';
import { Redirect, Stack } from 'expo-router';

const PrivateLayout = () => {
  const id = useAuth((state) => state.user?.id);
  if (!id) {
    return <Redirect href={'/login'} />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
};
export default PrivateLayout;
