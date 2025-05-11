import { useIsFirst } from '@/lib/zustand/useIsFirst';
import { Redirect } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const LoginScreen = () => {
  const { isFirst } = useIsFirst();
  if (isFirst) {
    return <Redirect href={'/'} />;
  }
  return (
    <View>
      <Text>Login</Text>
    </View>
  );
};

export default LoginScreen;
