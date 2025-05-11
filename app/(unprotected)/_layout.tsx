import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const UnprotectedLayout = () => {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{ headerShown: false, animation: 'slide_from_left' }}
      />
    </>
  );
};

export default UnprotectedLayout;
