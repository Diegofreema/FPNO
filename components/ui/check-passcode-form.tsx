import { useAuth } from '@/lib/zustand/useAuth';
import { useFingerPrint } from '@/lib/zustand/useFingerPrint';
import { usePassCode } from '@/lib/zustand/usePasscode';
import { useIsLocked, usePath } from '@/lib/zustand/usePath';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
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
import { useShowToast } from '@/lib/zustand/useShowToast';
import { IconBackspace } from '@tabler/icons-react-native';
import { MotiView } from 'moti';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { AnimatedContainerCheckPasscode } from '../animated/animated-container';
import { Title } from '../typography/title';

const OFFSET = 20;
const TIME = 80;
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
export const CheckPasscodeForm = () => {
  const [pin, setPin] = useState<number[]>([]);
  const storedPath = usePath((state) => state.currentPath);
  const { action } = useLocalSearchParams<{ action: 'delete' | 'change' }>();
  const code = usePassCode((state) => state.passCode);
  const formattedCode = code.replace(/,/g, '');
  const getPassCode = usePassCode((state) => state.getPassCode);
  const turnOffPassCode = usePassCode((state) => state.togglePassCode);
  const isLock = useFingerPrint((state) => state.lock);
  const unlock = useIsLocked((state) => state.unlock);
  const onShowToast = useShowToast((state) => state.onShow);
  const unlockDevice = useFingerPrint((state) => state.unlockDevice);
  const [isCorrect, setIsCorrect] = useState(false);
  const removeUser = useAuth((state) => state.removeUser);
  const unlockDeviceWithPin = usePassCode((state) => state.unlockDevice);

  const offSet = useSharedValue(0);
  const onPress = (item: (typeof dialPads)[number]) => {
    if (item === 'del' && code.length > 0) {
      setPin((prev) => prev?.slice(0, prev?.length - 1));
    } else if (typeof item === 'number') {
      if (code.length === pinLength) return;
      setPin((prev) => [...prev, item]);
    }
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offSet.value }],
    };
  });

  const onLogBackIn = useCallback(
    (text: string) => {
      setTimeout(() => {
        if (formattedCode !== text) {
          offSet.value = withSequence(
            withTiming(-OFFSET, { duration: TIME / 2 }),
            withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
            withTiming(0, { duration: TIME / 2 })
          );
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setPin([]);
          onShowToast({
            message: 'Error',
            description: 'Pin does not match',
            type: 'error',
          });
        } else {
          setIsCorrect(true);
          unlock();
          unlockDevice();
          unlockDeviceWithPin();
          router.replace(storedPath);
        }
      }, 500);

      setIsCorrect(false);
    },
    [
      formattedCode,
      offSet,
      onShowToast,
      storedPath,
      unlock,
      unlockDevice,
      unlockDeviceWithPin,
    ]
  );
  //   const displayText = action === 'change' ? 'Enter'
  const onDelete = useCallback(
    (text: string) => {
      setTimeout(() => {
        if (text === formattedCode) {
          turnOffPassCode(false);
          getPassCode('');
          router.back();

          onShowToast({
            message: 'Success',
            description: 'Pass code deleted successfully',
            type: 'success',
          });
        } else {
          offSet.value = withSequence(
            withTiming(-OFFSET, { duration: TIME / 2 }),
            withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
            withTiming(0, { duration: TIME / 2 })
          );
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

          onShowToast({
            message: 'Error',
            description: 'Pass code does not match',
            type: 'error',
          });
        }
      }, 500);
    },
    [formattedCode, getPassCode, offSet, turnOffPassCode, onShowToast]
  );
  const onEdit = useCallback(
    (text: string) => {
      if (text === formattedCode) {
        router.push('/passcode?action=change');

        setTimeout(() => setPin([]), 500);
      } else {
        offSet.value = withSequence(
          withTiming(-OFFSET, { duration: TIME / 2 }),
          withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
          withTiming(0, { duration: TIME / 2 })
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setTimeout(() => setPin([]), 500);

        onShowToast({
          message: 'Error',
          description: 'Pass code does not match',
          type: 'error',
        });
      }
    },
    [formattedCode, offSet, onShowToast]
  );
  const onVerifyPin = useCallback(
    (text: string) => {
      if (action === 'change') {
        onEdit(text);
      } else if (action === 'delete') {
        onDelete(text);
      } else {
        onLogBackIn(text);
      }
    },
    [action, onDelete, onEdit, onLogBackIn]
  );
  const onPasswordLogin = () => {
    removeUser();
    router.replace('/login');
  };

  useEffect(() => {
    const isValidLength = pin.length === pinLength;
    if (isValidLength) {
      onVerifyPin(pin.join(''));
    }
  }, [pin, onVerifyPin]);
  const hide = action !== 'change' && action !== 'delete';

  return (
    <AnimatedContainerCheckPasscode>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View style={[styles.pinContainer, animatedStyle]}>
          {[...Array(pinLength).keys()].map((i) => {
            const isSelected = pin[i] !== undefined && pin[i] !== null;
            return (
              <MotiView
                key={i}
                style={[
                  styles.pin,
                  {
                    backgroundColor: isCorrect ? 'green' : colors.black,
                  },
                ]}
                transition={{ type: 'timing', duration: 100 }}
                animate={{
                  height: isSelected ? pinSize : 2,
                  marginBottom: isSelected ? pinSize / 2 : 0,
                }}
              />
            );
          })}
        </Animated.View>
        <Text
          style={{
            color: 'red',
            fontSize: RFPercentage(1.7),
            fontFamily: 'NunitoBold',
            marginBottom: 10,
          }}
          onPress={() => router.push('/forgot-pin')}
        >
          Forgot your pin?
        </Text>
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
          ListFooterComponent={() => (
            <View
              style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}
            >
              {isLock && (
                <TouchableOpacity
                  onPress={() => router.push('/lock')}
                  style={{ alignItems: 'center' }}
                >
                  <Title
                    text="Login with fingerprint"
                    textStyle={{
                      color: colors.red,
                      fontSize: RFPercentage(1.6),
                    }}
                  />
                </TouchableOpacity>
              )}
              {isLock && (
                <View
                  style={{
                    width: 1,
                    height: 20,
                    backgroundColor: colors.border,
                  }}
                />
              )}
              {hide && (
                <TouchableOpacity
                  onPress={onPasswordLogin}
                  style={{
                    marginTop: 'auto',
                    alignItems: 'center',
                    marginBottom: 50,
                  }}
                >
                  <Title
                    text="Login with password"
                    textStyle={{ color: 'red', fontSize: RFPercentage(1.6) }}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          ListFooterComponentStyle={{ marginTop: 20 }}
        />
      </View>
    </AnimatedContainerCheckPasscode>
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
