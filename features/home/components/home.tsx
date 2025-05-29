import React from 'react';
import { View } from 'react-native';
import { Boxes } from './boxes';
import { Data } from './data';
import { ProfileHeader } from './profile-header';

const Home = () => {
  return (
    <View style={{ gap: 15 }}>
      <ProfileHeader />
      <Boxes />
      <Data />
    </View>
  );
};

export default Home;
