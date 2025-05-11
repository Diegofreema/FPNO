import { generateFromRandomNumbersOtp, sendEmail } from '@/helper';
import { useTempData } from '@/lib/zustand/useTempData';
import { Variants } from '@/types';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';

export const useLogin = (variant: Variants) => {
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
        return toast.error('Error', {
          description: 'Failed to login',
        });
      }
      if (data.result === 'incorrect credentials') {
        return toast.error('Error', {
          description: 'Incorrect credentials',
        });
      }
      const otp = generateFromRandomNumbersOtp();
      await sendEmail(data.email, otp);
      router.push(`/token?token=${otp}`);
      getTempUser({ variant, ...data });
      toast.success('Success', {
        description: 'An otp was sent to your email',
      });
    },
    onError: () => {
      toast.error('Error', {
        description: 'Failed to login, please try again later',
      });
    },
  });
};
