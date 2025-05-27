import { colors } from '@/constants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';

type Props = {
  onPress: () => void;
};

export const Helper = ({ onPress }: Props) => {
  return (
    <Animated.View entering={FadeIn.delay(1000)} style={styles.container}>
      <Text style={styles.text}>
        if you have difficulty, please contact the ICT Helpdesk at:
      </Text>
      <TouchableOpacity onPress={onPress} style={{ marginTop: 10 }}>
        <Text style={styles.text2}>student.ictsupport@fpno.edu.ng</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginBottom: 20,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'NunitoRegular',
    fontSize: RFPercentage(1.7),
    textAlign: 'center',
    color: colors.black,
  },
  text2: {
    fontFamily: 'NunitoBold',
    fontSize: RFPercentage(2),
    color: colors.lightblue,
  },
});
