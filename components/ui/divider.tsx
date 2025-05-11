import { colors } from '@/constants';
import { View } from 'react-native';

export const Divider = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.border,
        height: 1,
      }}
    />
  );
};
export const Spacer = ({ space }: { space: number }) => {
  return (
    <View
      style={{
        height: space,
        width: '100%',
      }}
    />
  );
};
export const VerticalDivider = ({ height = 20 }: { height?: number }) => {
  return (
    <View
      style={{
        width: 1,
        backgroundColor: colors.border,
        height,
      }}
    />
  );
};
