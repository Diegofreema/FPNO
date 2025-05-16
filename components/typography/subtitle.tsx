import { colors } from '@/constants';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

type Props = {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
};
export const SubTitle = ({ text, textStyle, numberOfLines = 5 }: Props) => {
  return (
    <Text style={[styles.title, textStyle]} numberOfLines={numberOfLines}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: RFPercentage(1.5),
    fontFamily: 'NunitoBold',
    color: colors.white,
    flex: 1,
  },
});
