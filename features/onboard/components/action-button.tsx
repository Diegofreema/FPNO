import { colors } from '@/constants';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';

type Props = {
  onNext: () => void;
  isLast: boolean;
};

export const ActionButton = ({ isLast, onNext }: Props) => {
  return (
    <Pressable
      onPress={onNext}
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.5 : 1,
        },
      ]}
    >
      {isLast ? (
        <Animated.Text key="continue" style={styles.continue}>
          Continue
        </Animated.Text>
      ) : (
        <Animated.Text key="finish" style={styles.next}>
          Next
        </Animated.Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightblue,
    marginBottom: 30,
    marginTop: 'auto',
  },
  continue: {
    color: colors.white,
    fontSize: RFPercentage(2),
    fontFamily: 'NunitoBold',
  },
  next: {
    color: colors.white,
    fontSize: RFPercentage(2),
    fontFamily: 'NunitoBold',
  },
});
