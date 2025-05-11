import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useSegments } from 'expo-router';
import { useEffect } from 'react';

const isLoggedIn = false;
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const segment = useSegments();

  console.log(segment);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    NunitoLight: require('../assets/fonts/NunitoLight.ttf'),
    NunitoRegular: require('../assets/fonts/NunitoRegular.ttf'),
    NunitoBold: require('../assets/fonts/NunitoBold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

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
