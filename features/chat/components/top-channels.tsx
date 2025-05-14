import { CustomPressable } from '@/components/ui/custom-pressable';
import { colors } from '@/constants';
import { ChannelType } from '@/types';
import { FontAwesome } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { TopChannel } from './top-channel';

type Props = {
  channels: ChannelType[];
};

const { width, height } = Dimensions.get('window');

export const TopChannels = ({ channels }: Props) => {
  return (
    <View
      style={{
        height: height * 0.1,
      }}
    >
      <LegendList
        data={channels}
        renderItem={({ item }) => <TopChannel channel={item} />}
        keyExtractor={(item) => item.$id}
        recycleItems
        horizontal
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={{ gap: 15 }}
      />
    </View>
  );
};

const ListFooterComponent = () => {
  const router = useRouter();
  const onPress = () => {
    router.push('/explore');
  };
  return (
    <CustomPressable style={styles.container} onPress={onPress}>
      <FontAwesome name="wpexplorer" size={30} color="white" />
    </CustomPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightblue,
    borderRadius: 100,
    width: width / 6,
    height: width / 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
});
