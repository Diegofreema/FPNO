import { Onboard } from '@/features/onboard/components/onboard';
import { useIsFirst } from '@/lib/zustand/useIsFirst';
import { Redirect } from 'expo-router';
import React from 'react';

const OnboardScreen = () => {
  const isFirstTime = useIsFirst((state) => state.isFirst);
  if (!isFirstTime) {
    return <Redirect href={'/login'} />;
  }
  return <Onboard />;
};

export default OnboardScreen;
