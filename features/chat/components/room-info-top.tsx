import { SubTitle } from '@/components/typography/subtitle';
import { colors } from '@/constants';
import { ChannelType } from '@/types';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

type Props = {
  data: ChannelType;
};

export const RoomInfoTop = ({ data }: Props) => {
  const memberText = data.members_count > 1 ? 'members' : 'member';
  return (
    <View style={{ gap: 10 }}>
      <View style={styles.container}>
        <Image
          source={data.image_url}
          placeholder={require('@/assets/images/place-user.jpeg')}
          style={styles.image}
          contentFit="cover"
        />
        <SubTitle
          text={data.channel_name}
          textStyle={styles.name}
          numberOfLines={1}
        />
        <SubTitle
          text={`${data.members_count} ${memberText} `}
          textStyle={styles.count}
          numberOfLines={1}
        />
      </View>
      <SubTitle text="Members" textStyle={styles.name} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    gap: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    color: colors.black,
    fontSize: RFPercentage(1.8),

    flex: 0,
  },
  count: {
    color: colors.black,
    flex: 0,
    textAlign: 'center',
  },
});
