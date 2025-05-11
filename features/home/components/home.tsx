import { useFirstTimeModal } from '@/lib/zustand/useFirstTimeModal';
import { usePathname } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Boxes } from './boxes';
import { FingerPrintModal } from './finger-print-modal';
import { ProfileHeader } from './profile-header';

const Home = () => {
  const [visible, setVisible] = useState(false);
  const isFirstTime = useFirstTimeModal((state) => state.isFirstTime);
  const pathname = usePathname();

  return (
    <View>
      <FingerPrintModal visible={visible} onClose={() => setVisible(false)} />
      <ProfileHeader />
      <Boxes />
    </View>
  );
};

export default Home;
