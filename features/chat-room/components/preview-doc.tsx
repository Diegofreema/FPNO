import {DownloadBlurView} from '@/features/chat/components/download-blur';
import {useRouter} from 'expo-router';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import Pdf from 'react-native-pdf';

type Props = {
  uri: string;
};



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

    </>
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
  },

});
