import {useAuth} from '@/lib/zustand/useAuth';
import {useFingerPrint} from '@/lib/zustand/useFingerPrint';
import {usePassCode} from '@/lib/zustand/usePasscode';
import {useIsLocked, usePath} from '@/lib/zustand/usePath';
import {Href, Redirect, Stack, usePathname, useRouter} from 'expo-router';
import {useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';

const PrivateLayout = () => {
  const id = useAuth((state) => state.user?.id);

  const router = useRouter();

  const lock = useFingerPrint((state) => state.lock);
  const lockDevice = useFingerPrint((state) => state.lockDevice);
  const isPassCode = usePassCode((state) => state.isPassCode);
  const passCode = usePassCode((state) => state.passCode);
  const lockDeviceWithPassCode = usePassCode((state) => state.lockDevice);

  const setLock = useIsLocked((state) => state.lock);
  const setPath = usePath((state) => state.setPath);

  const currentPath = usePath((state) => state.currentPath);
  const appState = useRef(AppState.currentState);
  const pathname = usePathname();
  console.log(pathname);
  const pathToStore =
    pathname === '/lock' || pathname === '/check-passcode'
      ? currentPath
      : pathname;
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (
          pathname.includes('chat') ||
          pathname.includes('group-chat') ||
          pathname.includes('camera') ||
          pathname.includes('preview-file')
        )
          return;
        if (lock && pathname !== '/lock' && pathname !== '/check-passcode') {
          setLock();
          router.replace('/lock');
          return;
        }
        if (
          isPassCode &&
          pathname !== '/check-passcode' &&
          pathname !== '/lock'
        ) {
          console.log('processed');
          router.replace('/check-passcode');
        }
      } else {
        setPath(pathToStore as Href);
        if (lock) {
          lockDevice();
        }
        if (passCode) {
          lockDeviceWithPassCode();
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [router,
    lock,
    pathname,
    setLock,
    isPassCode,
    setPath,
    lockDevice,
    lockDeviceWithPassCode,
    passCode,
    pathToStore,
  ]);
  if (!id) return <Redirect href="/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
};
export default PrivateLayout;
