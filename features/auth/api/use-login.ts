import { generateFromRandomNumbersOtp, sendEmail } from '@/helper';
import { useShowToast } from '@/lib/zustand/useShowToast';
import { useTempData } from '@/lib/zustand/useTempData';
import { Variants } from '@/types';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'expo-router';

export const useLogin = (variant: Variants) => {
  const { onShow } = useShowToast();
  const router = useRouter();
  const getTempUser = useTempData((state) => state.getUser);
  return useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const baseApi = variant === 'LECTURER' ? 'lecturerlogin' : 'userlogin';
      const { data } = await axios(
        `https://estate.netpro.software/api.aspx?api=${baseApi}&email=${
          values.email
        }&pasword=${encodeURI(values.password)}`
      );

      return data;
    },
    onSuccess: async (data) => {
      if (data.result === 'failed') {
        return onShow({
          message: 'Error',
          description: 'Failed to login',
          type: 'error',
        });
      }
      if (data.result === 'incorrect credentials') {
        return onShow({
          message: 'Error',
          description: 'Incorrect credentials',
          type: 'error',
        });
      }
      const otp = generateFromRandomNumbersOtp();
      await sendEmail(data.email, otp);
      router.push(`/token?token=${otp}`);
      getTempUser({ variant, ...data });
      onShow({
        message: 'Success',
        description: 'An otp was sent to your email',
        type: 'success',
      });
    },
    onError: () => {
      onShow({
        message: 'Error',
        description: 'Failed to login, please try again later',
        type: 'error',
      });
    },
  });
};
