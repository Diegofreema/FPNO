import { useIsFirst } from '@/lib/zustand/useIsFirst';
import { Stack, useSegments } from 'expo-router';

const isLoggedIn = false;
export default function RootLayout() {
  const segment = useSegments();
  const isFirst = useIsFirst((state) => state.isFirst);
  console.log(segment, isFirst);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="private" />
      </Stack.Protected>
    </Stack>
  );
}
