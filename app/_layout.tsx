import { Stack, useSegments } from 'expo-router';

const isLoggedIn = false;
export default function RootLayout() {
  const segment = useSegments();
  console.log(segment);

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
