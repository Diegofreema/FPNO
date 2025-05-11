import { colors, pinSize, pinSpacing, spacing } from '@/constants';
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
type Props = {
  animatedStyle: {
    transform: {
      translateX: number;
    }[];
  };
  pinLength: number;
  code: number[];
};

export const OtpForm = ({ animatedStyle, code, pinLength }: Props) => {
  return (
    <Animated.View style={[styles.pinContainer, animatedStyle]}>
      {[...Array(pinLength).keys()].map((i) => {
        const isSelected = code[i] !== undefined && code[i] !== null;
        return (
          <MotiView
            key={i}
            style={[styles.pin]}
            transition={{ type: 'timing', duration: 100 }}
            animate={{
              height: isSelected ? pinSize : 2,
              marginBottom: isSelected ? pinSize / 2 : 0,
            }}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pin: {
    width: pinSize,
    height: pinSize,
    borderRadius: pinSize / 2,
    backgroundColor: colors.black,
  },
  pinContainer: {
    flexDirection: 'row',
    gap: pinSpacing * 2,
    alignItems: 'flex-end',
    marginBottom: spacing * 2,
    height: pinSize * 2,
  },
});
