import * as Haptics from "expo-haptics";
import {router} from "expo-router";
import {useCallback, useEffect, useState} from "react";
import {View,} from "react-native";
import {useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming,} from "react-native-reanimated";
import {generateFromRandomNumbersOtp, sendEmail} from "@/helper";
import {useAuth} from "@/lib/zustand/useAuth";
import {useShowToast} from "@/lib/zustand/useShowToast";
import {useStoreId} from "@/lib/zustand/useStoreId";
import {AnimatedContainerToken} from "../animated/animated-container";
import {Resend} from "../resend";
import {toast} from "sonner-native";
import {OtpForm} from "@/features/auth/components/otp-input";
import {OtpButtons} from "@/features/auth/components/otp-buttons";
import {dialPads} from "@/constants";

const OFFSET = 20;
const TIME = 80;


const pinLength = 5;




export const ForgotForm = () => {
  const [code, setCode] = useState<number[]>([]);
  const setDetails = useStoreId((state) => state.setDetails);
  const details = useStoreId((state) => state.details);
  const [token, setToken] = useState("");
  const { onShow } = useShowToast();
  const offset = useSharedValue(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [sending, setSending] = useState(false);
  const user = useAuth((state) => state.user);
  const getUser = useAuth((state) => state.getUser);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });
  const onPress = (item: (typeof dialPads)[number]) => {
    if (item === "del" && code.length > 0) {
      setCode((prev) => prev?.slice(0, prev?.length - 1));
    } else if (typeof item === "number") {
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
  console.log({email: user?.email})
  const resend = useCallback(async () => {
    const otp = generateFromRandomNumbersOtp();
    setToken(otp);
    setSending(true);
    try {
      await sendEmail(user?.email!, otp);
      setIsActive(true);
      setTimeLeft(60);
      toast.success("Success", {
        description: "Otp has been sent to your mail",
      });
    } catch (error) {
      console.log(error);
      toast.success("Failed", {
        description: "Could not resend, please try again",
      });
    } finally {
      setSending(false);
    }
  }, [user?.email]);
  useEffect(() => {
    void resend();
  }, [resend]);
  useEffect(() => {
    const isValid = token === code.join("");
    const isFilled = code.length === pinLength;
    if (isFilled && isValid) {
      setTimeout(() => {
        router.push("/passcode?action=change");

        onShow({
          message: "Success",
          description: "Change token",
          type: "success",
        });
      }, 500);

      setTimeout(() => setCode([]), 500);
    } else if (isFilled && !isValid) {
      offset.value = withSequence(
        withTiming(-OFFSET, { duration: TIME / 2 }),
        withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
        withTiming(0, { duration: TIME / 2 }),
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      onShow({
        message: "Error",
        description: "Token does not match",
        type: "error",
      });
      setTimeout(() => setCode([]), TIME * 2);
    }
  }, [code, offset, token, user, getUser, details, setDetails, onShow]);

  const disabled = timeLeft > 0 || sending;
  console.log(timeLeft, token);
  return (
    <AnimatedContainerToken>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
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


