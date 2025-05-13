import { ProfileBackground } from '@/features/profile/components/profile-background';
import { ProfileInfo } from '@/features/profile/components/profile-info';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'moti';
import React from 'react';

const Profile = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40, backgroundColor: 'white' }}
    >
      <ProfileBackground>
        <StatusBar style={'light'} />
        <ProfileInfo />
      </ProfileBackground>
    </ScrollView>
  );
};
export default Profile;
