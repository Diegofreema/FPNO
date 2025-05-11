import { colors } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  resend: () => void;
  disabled: boolean;
};
export const Resend = ({ resend, disabled }: Props) => {
  return (
    <View style={styles.resendContainer}>
      <Text style={{ fontFamily: 'NunitoRegular' }}>
        Didn’t receive the code?
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={resend}
        disabled={disabled}
      >
        <Text style={[styles.resend, disabled && { opacity: 0.4 }]}>
          {' '}
          Resend
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  resendContainer: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  resend: {
    color: colors.lightblue,
    fontFamily: 'NunitoBold',
  },
});
