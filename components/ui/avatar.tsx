import { colors } from '@/constants';
import { useAuth } from '@/lib/zustand/useAuth';
import { Image } from 'expo-image';
import { DimensionValue, StyleSheet, View } from 'react-native';

export const Avatar = ({
  size = 60,
  imgSrc,
}: {
  size?: DimensionValue;
  imgSrc?: string;
}) => {
  const { user } = useAuth();
  const id = user?.id;
  const url = imgSrc || `https://fpn.netpro.software/Uploads/${id}.jpeg`;
  return (
    <View
      style={[
        styles.initialsContainer,
        {
          height: size,
          width: size,
          borderRadius: 99999,
          overflow: 'hidden',
        },
      ]}
    >
      <Image
        source={{ uri: url }}
        style={{ width: '100%', height: '100%' }}
        placeholder={require('@/assets/images/place-user.jpeg')}
        contentFit="cover"
        placeholderContentFit="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  initialsContainer: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.lightblue,
  },
  initials: {
    color: colors.white,
    fontFamily: 'NunitoBold',
  },
});
