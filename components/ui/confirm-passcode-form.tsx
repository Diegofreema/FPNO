import * as Haptics from 'expo-haptics';
import {Href, router, useLocalSearchParams} from 'expo-router';
import {useEffect} from 'react';
import {View,} from 'react-native';

import {dialPads} from '@/constants';
import {usePassCode} from '@/lib/zustand/usePasscode';
import {usePath} from '@/lib/zustand/usePath';
import {useShowToast} from '@/lib/zustand/useShowToast';
import {useSharedValue, withRepeat, withSequence, withTiming,} from 'react-native-reanimated';
import {AnimatedContainer} from '../animated/animated-container';
import {useAuth} from "@/lib/zustand/useAuth";
import {OtpForm} from "@/features/auth/components/otp-input";
import {OtpButtons} from "@/features/auth/components/otp-buttons";
import {useOtpCodes} from "@/hooks/useOtpCodes";
import {toast} from "sonner-native";


const pinLength = 4;


const OFFSET = 20;
const TIME = 80;
export const ConfirmPassCode = () => {
  const { code, action } = useLocalSearchParams<{
    code: string;
    action?: string;
  }>();
  const {code: pin, onPress, setCode,animatedStyle} = useOtpCodes()
  const {user} = useAuth()
  const pathInStore = usePath((state) => state.currentPath);
  const path: Href = pathInStore ? pathInStore :
     ( user?.variant === 'STUDENT' ? '/(private)/(tabs)' : '/chat')
  const getPassCode = usePassCode((state) => state.getPassCode);
  const togglePassCode = usePassCode((state) => state.togglePassCode);
  const isPassCode = usePassCode((state) => state.isPassCode);
  const onShowToast = useShowToast((state) => state.onShow);
  const setPath = usePath((state) => state.setPath);
  const offset = useSharedValue(0);



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


        toast.success('Success', {
          description: `Pass code ${
              action === 'change' ? 'edited' : 'created'
          } successfully`
        })

        router.replace(path);
        setPath(path);
      }, 500);
    } else if (isFilled && !isValid) {
      offset.value = withSequence(
        withTiming(-OFFSET, { duration: TIME / 2 }),
        withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
        withTiming(0, { duration: TIME / 2 })
      );
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      toast.error('Error', {
        description: 'Pin does not match'
      })

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
    path,
    setCode
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
        <OtpForm
            animatedStyle={animatedStyle}
            code={pin}
            pinLength={pinLength}
        />

        <OtpButtons dialPads={dialPads} onPress={onPress} />

      </View>
    </AnimatedContainer>
  );
};


