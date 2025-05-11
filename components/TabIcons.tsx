import { colors } from '@/constants';
import { Icon } from '@tabler/icons-react-native';
import { useEffect } from 'react';
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type TabIconsType = {
  icon: Icon;
  focused: boolean;
  size: number;
  id: string;
};
export const TabIcons = ({ icon: Icon, focused, size, id }: TabIconsType) => {
  const AnimatedIcon = Animated.createAnimatedComponent(Icon);
  const isFocused = useSharedValue(0.9);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: isFocused.value }],
    };
  });

  useEffect(() => {
    if (focused) {
      isFocused.value = withSpring(1.05);
    } else {
      isFocused.value = withSpring(0.9);
    }
  }, [focused, isFocused]);
  return (
    <AnimatedIcon
      layout={LinearTransition.springify().damping(80).stiffness(200)}
      size={size}
      style={animatedStyle}
      color={focused ? colors.lightblue : colors.gray}
      key={id}
    />
  );
};
