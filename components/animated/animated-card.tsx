import { StyleProp, ViewStyle } from 'react-native';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  index: number;
  style?: StyleProp<ViewStyle>;
};

export const AnimatedCard = ({ children, index, style }: Props) => {
  const getSlideDirection = (index: number) => {
    const baseAnimation = index % 2 === 0 ? SlideInLeft : SlideInRight;
    return baseAnimation.springify().damping(25);
  };

  const SlideDirection = getSlideDirection(index);
  return (
    <Animated.View entering={SlideDirection} style={style}>
      {children}
    </Animated.View>
  );
};
