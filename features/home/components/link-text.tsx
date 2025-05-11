import { colors } from '@/constants';
import { Href, Link } from 'expo-router';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';

type Props = {
  text: string;
  link: Href;
  textStyle?: StyleProp<TextStyle>;
};
export const LinkText = ({ link, text, textStyle }: Props) => {
  return (
    <Link href={link} style={[styles.link, textStyle]}>
      {text}
    </Link>
  );
};

const styles = StyleSheet.create({
  link: {
    color: colors.lightblue,
    textDecorationLine: 'underline',
    fontFamily: 'NunitoBold',
  },
});
