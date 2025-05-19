import { Image } from 'expo-image';
import { Dimensions, StyleSheet, View } from 'react-native';

import { CustomPressable } from '@/components/ui/custom-pressable';
import { colors } from '@/constants';
import { Check, X } from 'lucide-react-native';

const { height, width } = Dimensions.get('window');

export const PreviewImage = ({
  img,
  onClose,
  onAccept,
}: {
  img: string;
  onClose: () => void;
  onAccept: () => void;
}) => {
  return (
    <View style={{ height, width }}>
      <CustomPressable style={styles.x} onPress={onClose}>
        <X size={25} color={colors.white} />
      </CustomPressable>
      <Image
        source={{ uri: img }}
        style={{ width: '100%', height: '100%' }}
        contentFit={'cover'}
      />
      <CustomPressable style={styles.y} onPress={onAccept}>
        <Check size={30} color={colors.white} />
      </CustomPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  x: {
    position: 'absolute',
    left: 15,
    top: height * 0.04,
    zIndex: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 10,
  },
  y: {
    position: 'absolute',
    zIndex: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 10,
    bottom: 50,
    right: 20,
  },
});
