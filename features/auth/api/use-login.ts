import { useAuth } from '@/lib/zustand/useAuth';
import { useShowToast } from '@/lib/zustand/useShowToast';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useLogin = () => {
  const { onShow } = useShowToast();
  const getUser = useAuth((state) => state.getUser);
  return useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const { data } = await axios(
        `https://estate.netpro.software/api.aspx?api=userlogin&email=${values.email}&pasword=${values.password}`
      );

      return data;
    },
    onSuccess: (data) => {
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
      getUser(data);
      onShow({
        message: 'Success',
        description: 'Welcome back',
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
