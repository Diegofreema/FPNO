import { ScrollWrapper } from '@/components/ui/wrapper';
import { FingerPrintModal } from '@/features/home/components/finger-print-modal';
import Home from '@/features/home/components/home';
import { useAuth } from '@/lib/zustand/useAuth';
import { useFingerPrint } from '@/lib/zustand/useFingerPrint';
import { useFirstTimeModal } from '@/lib/zustand/useFirstTimeModal';
import { usePassCode } from '@/lib/zustand/usePasscode';
import { Redirect, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';

const HomeScreen = () => {
  const variant = useAuth((state) => state.user?.variant);

  const [visible, setVisible] = useState(false);
  const isFirstTime = useFirstTimeModal((state) => state.isFirstTime);
  const pathname = usePathname();

  const lock = useFingerPrint((state) => state.lock);
  const deviceIsLock = useFingerPrint((state) => state.deviceIsLock);
  const deviceIsLockWithPin = usePassCode((state) => state.deviceIsLock);
  useEffect(() => {
    if (!lock && pathname === '/' && isFirstTime) {
      setTimeout(() => setVisible(true), 4000);
    }
  }, [lock, pathname, isFirstTime]);
  if (deviceIsLock && pathname !== '/lock' && pathname !== 'check-passcode')
    return <Redirect href="/lock" />;
  if (
    deviceIsLockWithPin &&
    pathname !== '/lock' &&
    pathname !== 'check-passcode'
  )
    return <Redirect href="/check-passcode" />;

  if (variant === 'LECTURER') {
    return <Redirect href={'/chat'} />;
  }
  return (
    <ScrollWrapper>
      <FingerPrintModal visible={visible} onClose={() => setVisible(false)} />
      <Home />
    </ScrollWrapper>
  );
};

export default HomeScreen;
