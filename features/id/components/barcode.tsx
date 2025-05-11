import { useAuth } from '@/lib/zustand/useAuth';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

export const Barcode = () => {
  const id = useAuth((state) => state.user?.id);

  return (
    <View style={{ backgroundColor: 'white', padding: 10 }}>
      <Image
        source={{
          uri: `https://fpn.netpro.software/Uploads/Stqrcode${id}.jpeg`,
        }}
        style={styles.barcode}
        contentFit="cover"
        placeholder={require('@/assets/images/place.webp')}
        placeholderContentFit="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  barcode: {
    width: 100,
    height: 100,
  },
});
