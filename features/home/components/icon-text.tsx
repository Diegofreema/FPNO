import { colors } from '@/constants';
import { Icon } from '@tabler/icons-react-native';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

type Props = {
  icon: Icon;
  text: string;
  textStyle?: StyleProp<TextStyle>;

  style?: StyleProp<ViewStyle>;
};

export const IconText = ({
  text,
  icon: Icon,
  textStyle,

  style,
}: Props) => {
  return (
    <View
      style={[{ flexDirection: 'row', alignItems: 'center', gap: 5 }, style]}
    >
      <Icon color={colors.lightblue} size={RFPercentage(2)} />
      <Text
        style={[
          styles.subText,
          {
            fontSize: RFPercentage(1.4),
            textAlign: 'right',
            color: colors.textGray,
          },
          textStyle,
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  subText: {
    color: colors.textGray,
    fontFamily: 'NunitoRegular',
  },
});
