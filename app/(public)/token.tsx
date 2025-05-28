import { TokenForm } from '@/components/form/token-form';
import { CustomBackgroundImage } from '@/components/ui/custom-background';
import { ScrollWrapper } from '@/components/ui/wrapper';
import { useTempData } from '@/lib/zustand/useTempData';
import React from 'react';

const TokenScreen = () => {
  const user = useTempData((state) => state.user);
  return (
    <ScrollWrapper styles={{ paddingHorizontal: 0 }}>
      <CustomBackgroundImage
        text="E-Mail Address Verification"
        text2={`Enter the 5 Digit Code sent to ${user?.email}`}
      >
        <TokenForm />
      </CustomBackgroundImage>
    </ScrollWrapper>
  );
};

export default TokenScreen;
