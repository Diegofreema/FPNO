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

// import { generateFromRandomNumbersOtp, sendEmail } from "@/helper";
import { mail } from '@/constants';
import { useLogin } from '@/features/auth/api/use-login';
import { AccountSwitcher } from '@/features/auth/components/account-switcher';
import { Helper } from '@/features/auth/components/helper';
import { Variants } from '@/types';

export const LoginForm = () => {
  const [secure, setSecure] = useState<boolean>(true);
  const [variant, setVariant] = useState<Variants>('LECTURER');
  const toggleSecure = () => setSecure(!secure);
  const { mutateAsync } = useLogin();

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
    await mutateAsync(values);
    reset();
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
