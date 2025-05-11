import { useAuth } from '@/lib/zustand/useAuth';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

const PublicLayout = () => {
  const id = useAuth((state) => state.user?.id);
  if (id) {
    return <Redirect href={'/(private)/(tabs)'} />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default PublicLayout;
