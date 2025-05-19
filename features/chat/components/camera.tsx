import { CustomPressable } from '@/components/ui/custom-pressable';
import { colors } from '@/constants';
import { useMount } from '@/hooks/use-mount';
import { useGetImage } from '@/lib/zustand/useGetImage';
import { RefreshCcw, X, Zap, ZapOff } from 'lucide-react-native';

import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  Camera,
  CameraPosition,
  useCameraDevice,
} from 'react-native-vision-camera';
import { PreviewImage } from './preview-image';

const { height } = Dimensions.get('window');
export const CameraComponent = () => {
  const isMounted = useMount();
  const [imageUrl, setImageUrl] = useState('');
  const { setImage } = useGetImage();
  const camera = useRef<Camera>(null);
  const [mode, setMode] = useState<CameraPosition>('back');
  const [flash, setFlash] = useState<'on' | 'off' | 'auto'>('off');
  // const { path } = useLocalSearchParams<{ path: string }>();
  const device = useCameraDevice(mode);
  const takePhoto = async () => {
    const photo = await camera?.current?.takePhoto({
      flash,
    });
    if (photo) {
      setImageUrl(`file://${photo?.path}`);
      setImage(`file://${photo?.path}`);
    }
    // const result = await fetch(`file://${photo?.path}`);
    // const data = await result.blob();
  };
  if (!device) return <View style={{ backgroundColor: 'red' }} />;
  const onToggleFlash = () => {
    setFlash((prev) => (prev === 'off' ? 'on' : 'off'));
  };
  const onClose = () => {
    router.back();
  };
  const onToggleMode = () => {
    setMode((prev) => (prev === 'back' ? 'front' : 'back'));
  };
  const acceptImage = () => {
    router.back();
  };
  return imageUrl ? (
    <PreviewImage
      img={imageUrl}
      onClose={() => setImageUrl('')}
      onAccept={acceptImage}
    />
  ) : (
    <View style={{ flex: 1, backgroundColor: 'green' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <CustomPressable style={styles.x} onPress={onClose}>
          <X size={25} color={colors.white} />
        </CustomPressable>
        <CustomPressable style={styles.y} onPress={onToggleFlash}>
          {flash === 'off' ? (
            <ZapOff size={25} color={colors.white} />
          ) : (
            <Zap size={25} color={colors.white} />
          )}
        </CustomPressable>
        <CustomPressable
          style={[styles.y, { top: height * 0.12 }]}
          onPress={onToggleMode}
        >
          <RefreshCcw color={colors.white} size={25} />
        </CustomPressable>
      </View>
      <Camera
        ref={camera}
        isActive={isMounted}
        device={device}
        style={{ flex: 1 }}
        photo
        photoQualityBalance="balanced"
      />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 50,
        }}
      >
        <CustomPressable style={styles.snap} onPress={takePhoto} />
      </View>
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
    right: 15,
    top: height * 0.04,
    zIndex: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 10,
  },
  snap: {
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: 'white',
  },
  rotate: {},
});
