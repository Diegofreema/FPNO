import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { Dimensions, Modal, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionIcon } from '@/components/ui/action-icon';
import { DownloadBlurView } from './download-blur';

type Props = {
  url: string;
  type: 'image' | 'pdf';
  visible: boolean;
  hideModal: () => void;
};
const { height } = Dimensions.get('window');
export const PreviewModal = ({ hideModal, visible, url, type }: Props) => {
  const { top } = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      onRequestClose={hideModal}
      animationType="slide"
      style={{ height: 600 }}
    >
      <View style={{ marginTop: top, flex: 1 }}>
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
        <DownloadBlurView url={url} onClose={hideModal} />
        <ActionIcon name="times" onPress={hideModal} style={styles.abs} />
      </View>
    </Modal>
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
