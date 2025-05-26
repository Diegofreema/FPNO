import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants';
import { usePassCode } from '@/lib/zustand/usePasscode';
import { usePath } from '@/lib/zustand/usePath';
import { useShowToast } from '@/lib/zustand/useShowToast';
import { IconBackspace } from '@tabler/icons-react-native';
import { MotiView } from 'moti';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedContainer } from '../animated/animated-container';

const dialPads = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'];
const { width } = Dimensions.get('window');
const pinLength = 4;
const pinContainerSize = width / 2;
const pinMaxSize = pinContainerSize / pinLength;
const spacing = 20;
const pinSpacing = 10;
const pinSize = pinMaxSize - pinSpacing * 2;
const dialPadSize = width * 0.18;
const dialPadItemSize = dialPadSize * 0.3;

const OFFSET = 20;
const TIME = 80;
export const ConfirmPassCode = () => {
  const { code, action } = useLocalSearchParams<{
    code: string;
    action?: string;
  }>();
  const [pin, setCode] = useState<number[]>([]);

  const getPassCode = usePassCode((state) => state.getPassCode);
  const togglePassCode = usePassCode((state) => state.togglePassCode);
  const isPassCode = usePassCode((state) => state.isPassCode);
  const onShowToast = useShowToast((state) => state.onShow);
  const setPath = usePath((state) => state.setPath);
  const offset = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });
  const onPress = (item: (typeof dialPads)[number]) => {
    if (item === 'del' && code.length > 0) {
      setCode((prev) => prev?.slice(0, prev?.length - 1));
    } else if (typeof item === 'number') {
      if (code.length === pinLength) return;
      setCode((prev) => [...prev, item]);
    }
  };
  console.log(pin.join(''), { code });
  const formatedCode = code.replace(/,/g, '');

  useEffect(() => {
    const isValid = formatedCode === pin.join('').replace(/,/g, '');

    const isFilled = pin.length === pinLength;
    if (isFilled && isValid) {
      setTimeout(() => {
        getPassCode(code);
        if (!isPassCode) {
          togglePassCode(true);
        }

        onShowToast({
          message: 'Success',
          description: `Pass code ${
            action === 'change' ? 'edited' : 'created'
          } successfully`,
          type: 'success',
        });

        router.replace('/');
        setPath('/');
      }, 500);
    } else if (isFilled && !isValid) {
      offset.value = withSequence(
        withTiming(-OFFSET, { duration: TIME / 2 }),
        withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
        withTiming(0, { duration: TIME / 2 })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      onShowToast({
        message: 'Error',
        description: 'Pin does not match',
        type: 'error',
      });

      setTimeout(() => setCode([]), TIME * 2);
    }
  }, [
    code,
    offset,
    setPath,
    action,
    getPassCode,
    isPassCode,
    pin,
    togglePassCode,
    onShowToast,
    formatedCode,
  ]);

  return (
    <AnimatedContainer>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '',
        }}
      >
        <Animated.View style={[styles.pinContainer, animatedStyle]}>
          {[...Array(pinLength).keys()].map((_, i) => {
            const isSelected = pin[i] !== undefined && pin[i] !== null;
            return (
              <MotiView
                key={i}
                style={[styles.pin]}
                transition={{ type: 'timing', duration: 100 }}
                animate={{
                  height: isSelected ? pinSize : 2,
                  marginBottom: isSelected ? pinSize / 2 : 0,
                }}
              />
            );
          })}
        </Animated.View>

        <FlatList
          style={{ flexGrow: 0 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          data={dialPads}
          renderItem={({ item }) => (
            <TouchableOpacity
              disabled={item === ''}
              onPress={() => onPress(item)}
            >
              <View
                style={[
                  styles.container,
                  { borderWidth: item === '' || item === 'del' ? 0 : 1 },
                ]}
              >
                {item === 'del' ? (
                  <IconBackspace
                    color={colors.black}
                    size={dialPadItemSize * 2}
                    strokeWidth={1}
                  />
                ) : (
                  <Text style={styles.text}>{item}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          numColumns={3}
          contentContainerStyle={{ gap: spacing, paddingBottom: 100 }}
          columnWrapperStyle={{ gap: spacing }}
        />
      </View>
    </AnimatedContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: dialPadSize,
    height: dialPadSize,
    borderRadius: dialPadSize,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: dialPadItemSize,
    fontFamily: 'NunitoRegular',
  },
  pinContainer: {
    flexDirection: 'row',
    gap: pinSpacing * 2,
    alignItems: 'flex-end',
    marginBottom: spacing * 2,
    height: pinSize * 2,
  },
  pin: {
    width: pinSize,
    height: pinSize,
    borderRadius: pinSize / 2,
    backgroundColor: colors.black,
  },
  resendContainer: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  resend: {
    color: colors.lightblue,
    fontFamily: 'NunitoBold',
  },
});
