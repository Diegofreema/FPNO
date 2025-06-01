import * as Haptics from 'expo-haptics';
import {Href, useLocalSearchParams, useRouter} from 'expo-router';
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {withRepeat, withSequence, withTiming,} from 'react-native-reanimated';

import {dialPads, OFFSET, pinLength, TIME} from '@/constants';
import {OtpButtons} from '@/features/auth/components/otp-buttons';
import {OtpForm} from '@/features/auth/components/otp-input';
import {sendEmail} from '@/helper';
import {useAuth} from '@/lib/zustand/useAuth';

import {useStoreId} from '@/lib/zustand/useStoreId';
import {useTempData} from '@/lib/zustand/useTempData';
import {toast} from 'sonner-native';
import {AnimatedContainerToken} from '../animated/animated-container';
import {Resend} from '../resend';
import {usePassCode} from "@/lib/zustand/usePasscode";
import {useOtpCodes} from "@/hooks/useOtpCodes";

export const TokenForm = () => {

const {code, onPress, setCode,offset,animatedStyle} = useOtpCodes()
  const setDetails = useStoreId((state) => state.setDetails);
  const details = useStoreId((state) => state.details);
  const { token } = useLocalSearchParams<{ token: string }>();

  const router = useRouter();
  const {isPassCode} = usePassCode()
  const [timeLeft, setTimeLeft] = useState(60);
  const [sending, setSending] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const user = useTempData((state) => state.user);
  const getUser = useAuth((state) => state.getUser);

  const path: Href =
    user?.variant === 'STUDENT' ? '/(private)/(tabs)' : '/chat';


  console.log({ token, variant: user?.variant });
  useEffect(() => {
    let interval: NodeJS.Timeout | null | number = null;

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

  useEffect(() => {
    const isValid = token === code.join('');
    const isFilled = code.length === pinLength;

    if (isFilled && isValid) {
      if (!user) return;
      setTimeout(() => {
        if (!details.department) {
          setDetails(user.id);
        }
        getUser(user);

        if(isPassCode) {
        router.push(path);
        } else  {
          router.push('/passcode')
        }
        toast.success('Success', {
          description: 'Welcome back',
        });
      }, 500);

      setTimeout(() => setCode([]), 500);
    } else if (isFilled && !isValid) {
      offset.value = withSequence(
        withTiming(-OFFSET, { duration: TIME / 2 }),
        withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
        withTiming(0, { duration: TIME / 2 })
      );
     void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      toast.error('Error', {
        description: 'Token does not match',
      });
      setTimeout(() => setCode([]), TIME * 2);
    }
  }, [code, offset, token, user, getUser, details, setDetails, router, path, isPassCode, setCode]);
  const resend = async () => {
    if (!user) return;
    setSending(true);
    try {
      await sendEmail(user.email, token);
      setIsActive(false);
      setTimeLeft(60);
      toast.success('Success', {
        description: 'Otp has been sent to your mail',
      });
    } catch {
      toast.error('Failed', {
        description: 'Could not resend, please try again',
      });
    } finally {
      setSending(false);
    }
  };
  const disabled = timeLeft > 0 || sending;
  return (
    <AnimatedContainerToken>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <OtpForm
          animatedStyle={animatedStyle}
          code={code}
          pinLength={pinLength}
        />
        <Resend resend={resend} disabled={disabled} />
        <OtpButtons dialPads={dialPads} onPress={onPress} />
      </View>
    </AnimatedContainerToken>
  );
};
