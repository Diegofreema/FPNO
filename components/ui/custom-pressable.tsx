import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & {};

export const CustomPressable = ({ ...props }: Props) => {
  return <TouchableOpacity {...props} hitSlop={10} activeOpacity={0.7} />;
};
