import { downloadAndSaveFile, downloadPdf } from '@/helper';
import { IconDownload } from '@tabler/icons-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { toast } from 'sonner-native';

type Props = {
  url: string;
  onClose: () => void;
  type: 'image' | 'pdf';
};

export const DownloadBlurView = ({ url, onClose, type }: Props) => {
  const [downloading, setDownloading] = useState(false);

  const onDownload = async () => {
    setDownloading(true);
    let result;
    try {
      if (type === 'pdf') {
        result = await downloadPdf(url);
      } else {
        result = await downloadAndSaveFile(url, type);
      }
      onClose();
      if (result === 'saved') {
        toast.success('Success', {
          description: 'Download was successful',
        });
      }
    } catch (e) {
      console.log(e);
      onClose();
      toast.error('Failed', {
        description: 'Could not download',
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
