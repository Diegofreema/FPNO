import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

import { colors } from '@/constants';
import { FontAwesome } from '@expo/vector-icons';
import { ActionIcon } from './action-icon';

type Props = {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  onPress: () => void;
  loading?: boolean;
};
export const AbsoluteAction = ({ onPress, name, loading }: Props) => {
  return (
    <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.abs}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.lightblue} />
      ) : (
        <ActionIcon name={name} onPress={onPress} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  abs: {
    position: 'absolute',
    right: 10,
    bottom: 50,
  },
});
