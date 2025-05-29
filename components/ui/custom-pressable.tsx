import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & {};

export const CustomPressable = ({ ...props }: Props) => {
  return <TouchableOpacity {...props} activeOpacity={0.7} hitSlop={20} />;
};
