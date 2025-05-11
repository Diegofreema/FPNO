import { colors } from '@/constants';
import { Icon } from '@tabler/icons-react-native';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

type Props = {
  text: string;
  onPress: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loadingColor?: string;
  icon?: Icon;
};
export const Button = ({
  onPress,
  text,
  isDisabled,
  isLoading,
  textStyle,
  loadingColor = 'white',
  style,
  icon: Icon,
}: Props) => {
  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
          height: 50,
          borderRadius: 5,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.lightblue,
          flexDirection: 'row',
          gap: 4,
        },
        style,
      ]}
    >
      {Icon && !isLoading && <Icon color={colors.white} size={25} />}
      {isLoading ? (
        <ActivityIndicator size="small" color={loadingColor} />
      ) : (
        <Text
          style={[
            {
              color: colors.white,
              fontSize: RFPercentage(2),
              fontFamily: 'NunitoBold',
            },
            textStyle,
          ]}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
};
