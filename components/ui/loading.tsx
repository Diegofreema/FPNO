import { colors } from '@/constants';
import React from 'react';
import { ActivityIndicator, useWindowDimensions, View } from 'react-native';

export const Loading = () => {
  const { height } = useWindowDimensions();
  return (
    <View
      style={{
        minHeight: height,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator color={colors.lightblue} size="large" />
    </View>
  );
};
