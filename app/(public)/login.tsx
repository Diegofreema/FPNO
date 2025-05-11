import { LoginForm } from '@/components/form/login-form';
import { CustomBackgroundImage } from '@/components/ui/custom-background';

import { useIsFirst } from '@/lib/zustand/useIsFirst';

import { Redirect } from 'expo-router';
import { ScrollView } from 'moti';
import React from 'react';

const LoginScreen = () => {
  const { isFirst } = useIsFirst();
  if (isFirst) {
    return <Redirect href={'/'} />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: 'white' }}
    >
      <CustomBackgroundImage
        text="Get Back into your Students Account"
        text2="Welcome Back, Kindly fill in your details to get back in your account"
      >
        <LoginForm />
      </CustomBackgroundImage>
    </ScrollView>
  );
};

export default LoginScreen;
