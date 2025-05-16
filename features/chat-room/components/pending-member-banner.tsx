import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  pendingMemberCount: number;
  roomId: string;
}
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
export const PendingMemberBanner = ({ pendingMemberCount, roomId }: Props) => {
  const height = useSharedValue(0);
  const router = useRouter();
  useEffect(() => {
    // Animate height to 50 when there are pending members, 0 when none
    height.value = withSpring(pendingMemberCount > 0 ? 50 : 0, {
      damping: 10,
      stiffness: 100,
    });
  }, [pendingMemberCount, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: 'hidden',
  }));
  const onPress = () => {
    router.push(`/pending-members?roomId=${roomId}`);
  };
  return (
    <AnimatedTouchableOpacity style={animatedStyle} onPress={onPress}>
      <View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
        <Text>
          {pendingMemberCount} {pendingMemberCount === 1 ? 'member' : 'members'}{' '}
          pending
        </Text>
      </View>
    </AnimatedTouchableOpacity>
  );
};
