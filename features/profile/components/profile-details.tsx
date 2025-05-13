import { colors } from '@/constants';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const ProfileDetail = ({
  style,
  text = 'Student Profile',
}: {
  style?: StyleProp<ViewStyle>;
  text?: string;
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: RFPercentage(2.7),
    fontFamily: 'NunitoBold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: RFPercentage(1.7),
    fontFamily: 'NunitoLight',
    textAlign: 'center',
    color: colors.textGray,
  },
  container: {
    marginTop: 60,
  },
});
