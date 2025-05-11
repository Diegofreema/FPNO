import { ScrollWrapper } from '@/components/ui/wrapper';
import Home from '@/features/home/components/home';
import { useAuth } from '@/lib/zustand/useAuth';
import { Redirect } from 'expo-router';
import React from 'react';

const HomeScreen = () => {
  const variant = useAuth((state) => state.user?.variant);

  if (variant === 'LECTURER') {
    return <Redirect href={'/chat'} />;
  }
  return (
    <ScrollWrapper>
      <Home />
    </ScrollWrapper>
  );
};

export default HomeScreen;
