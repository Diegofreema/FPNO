import { colors } from '@/constants';
import { Variants } from '@/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  variant: Variants;
  setVariant: (variant: Variants) => void;
};

const data: Variants[] = ['LECTURER', 'STUDENT'];
export const AccountSwitcher = ({ variant, setVariant }: Props) => {
  return (
    <View style={{ flexDirection: 'row', gap: 20 }}>
      {data.map((item, index) => (
        <TouchableOpacity
          style={[styles.normal, variant === item && styles.activeContainer]}
          key={index}
          onPress={() => setVariant(item)}
        >
          <Text style={[styles.text, variant === item && styles.activeText]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  normal: {
    borderWidth: 1,
    borderColor: colors.lightblue,
    padding: 5,
    borderRadius: 5,
  },
  text: {
    color: colors.lightblue,
    fontFamily: 'NunitoBold',
  },
  activeContainer: {
    backgroundColor: colors.lightblue,
  },
  activeText: {
    color: colors.white,
  },
});
