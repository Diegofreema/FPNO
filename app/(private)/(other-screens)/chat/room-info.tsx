import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const RoomInfo = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  console.log({ roomId });

  return (
    <View>
      <Text>RoomInfo</Text>
    </View>
  );
};

export default RoomInfo;
