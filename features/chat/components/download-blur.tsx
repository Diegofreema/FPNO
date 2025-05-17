import { downloadAndSaveImage } from '@/helper';
import { useShowToast } from '@/lib/zustand/useShowToast';
import { IconDownload } from '@tabler/icons-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  url: string;
  onClose: () => void;
};

export const DownloadBlurView = ({ url, onClose }: Props) => {
  const [downloading, setDownloading] = useState(false);
  const onShowToast = useShowToast((state) => state.onShow);
  const onDownload = async () => {
    setDownloading(true);
    try {
      const result = await downloadAndSaveImage(url);
      onClose();
      if (result === 'saved') {
        onShowToast({
          message: 'Success',
          type: 'success',
          description: 'Image has been downloaded',
        });
      }
    } catch (e) {
      console.log(e);
      onClose();
      onShowToast({
        message: 'Failed',
        type: 'error',
        description: 'Could not download image',
      });
    } finally {
      setDownloading(false);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDownload} disabled={downloading}>
        {downloading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <IconDownload size={30} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 70,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 3,
  },
});
