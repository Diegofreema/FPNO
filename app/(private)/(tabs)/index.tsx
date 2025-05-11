import { useAuth } from '@/lib/zustand/useAuth';
import { Redirect } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const IndexScreen = () => {
  const variant = useAuth((state) => state.user?.variant);
  if (variant === 'LECTURER') {
    return <Redirect href={'/chat'} />;
  }
  return (
    <View>
      <Text>IndexScreen</Text>
    </View>
  );
};

export default IndexScreen;
