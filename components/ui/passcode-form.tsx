import {router, useLocalSearchParams} from 'expo-router';
import {useEffect} from 'react';
import {View,} from 'react-native';

import {dialPads,} from '@/constants';
import {OtpForm} from "@/features/auth/components/otp-input";
import {useOtpCodes} from "@/hooks/useOtpCodes";
import {OtpButtons} from "@/features/auth/components/otp-buttons";

const pinLength = 4;

export const PassCodeForm = () => {
  const { action } = useLocalSearchParams<{ action?: string }>();
  const {code, onPress, setCode,animatedStyle} = useOtpCodes()


  useEffect(() => {
    const isFilled = code.length === pinLength;
    if (isFilled) {
      setTimeout(() => {
        router.push(`/confirm-passcode?code=${code}&action=${action}`);
        setCode([]);
      }, 500);
    }
  }, [code, action, setCode]);

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <OtpForm
          animatedStyle={animatedStyle}
          code={code}
          pinLength={pinLength}
      />

      <OtpButtons dialPads={dialPads} onPress={onPress} />

    </View>
  );
};


