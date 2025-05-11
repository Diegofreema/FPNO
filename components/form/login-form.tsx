import { zodResolver } from '@hookform/resolvers/zod';
import { openURL } from 'expo-linking';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AnimatedContainer } from '@/components/animated/animated-container';
import { CustomInput } from '@/components/form/custom-input';
import { Button } from '@/components/ui/button';
import { Stack } from '@/components/ui/stack';
import { loginSchema } from '@/lib/hookform/validators';
import axios from 'axios';

// import { generateFromRandomNumbersOtp, sendEmail } from "@/helper";
import { mail } from '@/constants';
import { AccountSwitcher } from '@/features/auth/components/account-switcher';
import { Helper } from '@/features/auth/components/helper';
import { useAuth } from '@/lib/zustand/useAuth';
import { useShowToast } from '@/lib/zustand/useShowToast';
import { Variants } from '@/types';

export const LoginForm = () => {
  const [secure, setSecure] = useState<boolean>(true);
  const [variant, setVariant] = useState<Variants>('LECTURER');
  const toggleSecure = () => setSecure(!secure);

  // const setDetails = useStoreId((state) => state.setDetails);
  // const getData = useTempData((state) => state.getUser);
  // ! to remove later
  const getUser = useAuth((state) => state.getUser);
  const { onShow } = useShowToast();
  const {
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
    control,
  } = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      password: '',
      email: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { data } = await axios(
        `https://estate.netpro.software/api.aspx?api=userlogin&email=${values.email}&pasword=${values.password}`
      );

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
      // const otp = generateFromRandomNumbersOtp();
      // await sendEmail(values.email, otp);
      getUser(data);
      // setDetails(data.id);
      onShow({
        message: 'Success',
        description: 'Welcome back',
        type: 'success',
      });
      // getData(data);
      reset();
      onShow({
        message: 'Success',
        description: 'An otp was sent to your email',
        type: 'success',
      });
      // router.push(`/token?token=${otp}`);
    } catch (e: any) {
      console.log('error', e);
      onShow({
        message: 'Error',
        description: 'Something went wrong',
        type: 'error',
      });
    }
  };
  const onPress = async () => {
    await openURL(mail);
  };

  return (
    <AnimatedContainer>
      <Stack style={{ gap: 25 }}>
        <CustomInput
          control={control}
          errors={errors}
          name="email"
          placeholder="Johndoe@gmail.com"
          label="Email"
          type="email-address"
        />
        <CustomInput
          control={control}
          errors={errors}
          name="password"
          placeholder="********"
          label="Password"
          password
          secureTextEntry={secure}
          toggleSecure={toggleSecure}
        />
        <AccountSwitcher variant={variant} setVariant={setVariant} />
        <Button
          text={'Login'}
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        />
      </Stack>
      <Helper onPress={onPress} />
    </AnimatedContainer>
  );
};
