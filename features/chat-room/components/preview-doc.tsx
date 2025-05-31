import { ActionIcon } from '@/components/ui/action-icon';
import { DownloadBlurView } from '@/features/chat/components/download-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import {Dimensions, Platform, StyleSheet} from 'react-native';
import Pdf from 'react-native-pdf';

type Props = {
  uri: string;
};

const { height } = Dimensions.get('window');

export const PreviewDoc = ({ uri }: Props) => {
  const router = useRouter();

  const url = uri.replace('view', 'download');

  // const getFileUrl = async () => {
  //   const result = storage.getFileDownload(BUCKET_ID, fileId);

  //   console.log(result);
  // };
  const onPress = () => {
    router.back();
  };
  return (
    <>
      <Pdf
        source={{ uri, cache: true }}
        style={styles.pdf}
        enableDoubleTapZoom
        trustAllCerts={Platform.OS !== 'android'}
        enablePaging
        minScale={0.5}
        maxScale={5}
      />
      <DownloadBlurView url={url} onClose={onPress} type="pdf" />
      <ActionIcon name="times" onPress={onPress} style={styles.abs} />
    </>
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
  },
  abs: {
    zIndex: 2,
    position: 'absolute',
    top: height * 0.03,
    right: 15,
  },
});
