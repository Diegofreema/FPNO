import { IconBackspace } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/constants';
import { generateFromRandomNumbersOtp, sendEmail } from '@/helper';
import { useAuth } from '@/lib/zustand/useAuth';
import { useShowToast } from '@/lib/zustand/useShowToast';
import { useStoreId } from '@/lib/zustand/useStoreId';
import { useTempData } from '@/lib/zustand/useTempData';
import { AnimatedContainerToken } from '../animated/animated-container';
import { Resend } from '../resend';

const OFFSET = 20;
const TIME = 80;
const dialPads = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'];
const { width } = Dimensions.get('window');
const pinLength = 5;
const pinContainerSize = width / 2;
const pinMaxSize = pinContainerSize / pinLength;
const spacing = 20;
const pinSpacing = 10;
const pinSize = pinMaxSize - pinSpacing * 2;
const dialPadSize = width * 0.18;
const dialPadItemSize = dialPadSize * 0.3;
export const ForgotForm = () => {
  const [code, setCode] = useState<number[]>([]);
  const setDetails = useStoreId((state) => state.setDetails);
  const details = useStoreId((state) => state.details);
  const [token, setToken] = useState('');
  const { onShow } = useShowToast();
  const offset = useSharedValue(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [sending, setSending] = useState(false);
  const user = useTempData((state) => state.user);
  const getUser = useAuth((state) => state.getUser);
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

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // When time is about to reach 0, stop the timer
            clearInterval(interval!);
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);
  const resend = useCallback(async () => {
    const otp = generateFromRandomNumbersOtp();
    setToken(otp);
    setSending(true);
    try {
      await sendEmail(user?.email!, otp);
      setIsActive(true);
      setTimeLeft(60);
      onShow({
        message: 'Success',
        type: 'success',
        description: 'Otp has been sent to your mail',
      });
    } catch (error) {
      console.log(error);
      onShow({
        message: 'Failed',
        type: 'error',
        description: 'Could not resend, please try again',
      });
    } finally {
      setSending(false);
    }
  }, [onShow, user?.email]);
  useEffect(() => {
    resend();
  }, [resend]);
  useEffect(() => {
    const isValid = token === code.join('');
    const isFilled = code.length === pinLength;
    if (isFilled && isValid) {
      setTimeout(() => {
        router.push('/passcode?action=change');

        onShow({
          message: 'Success',
          description: 'Change token',
          type: 'success',
        });
      }, 500);

      setTimeout(() => setCode([]), 500);
    } else if (isFilled && !isValid) {
      offset.value = withSequence(
        withTiming(-OFFSET, { duration: TIME / 2 }),
        withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
        withTiming(0, { duration: TIME / 2 })
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      onShow({
        message: 'Error',
        description: 'Token does not match',
        type: 'error',
      });
      setTimeout(() => setCode([]), TIME * 2);
    }
  }, [code, offset, token, user, getUser, details, setDetails, onShow]);

  const disabled = timeLeft > 0 || sending;
  console.log(timeLeft, token);
  return (
    <AnimatedContainerToken>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={[styles.pinContainer, animatedStyle]}>
          {[...Array(pinLength).keys()].map((i) => {
            const isSelected = code[i] !== undefined && code[i] !== null;
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
        <Resend resend={resend} disabled={disabled} />
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
    </AnimatedContainerToken>
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
});
