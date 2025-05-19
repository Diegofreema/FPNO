import { ActionIcon } from '@/components/ui/action-icon';
import { DownloadBlurView } from '@/features/chat/components/download-blur';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

type Props = {
  url: string;
};

const { height } = Dimensions.get('window');

export const PreviewChatImage = ({ url }: Props) => {
  const router = useRouter();
  const onPress = () => {
    router.back();
  };
  return (
    <View style={{ flex: 1 }}>
      <ImageZoom
        uri={url}
        style={{ width: '100%', height: '100%', flex: 1 }}
        minScale={0.5}
        maxPanPointers={1}
        maxScale={5}
        doubleTapScale={2}
        defaultSource={require('@/assets/images/place.webp')}
        isDoubleTapEnabled
        isSingleTapEnabled
        resizeMode="cover"
      />
      <DownloadBlurView url={url} onClose={onPress} type="image" />
      <ActionIcon name="times" onPress={onPress} style={styles.abs} />
    </View>
  );
};

const styles = StyleSheet.create({
  abs: {
    zIndex: 2,
    position: 'absolute',
    top: height * 0.03,
    right: 15,
  },
});
