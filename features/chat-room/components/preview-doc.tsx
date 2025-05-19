import React from 'react';
import { StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';

type Props = {
  uri: string;
};

export const PreviewDoc = ({ uri }: Props) => {
  return (
    <Pdf
      source={{ uri }}
      style={styles.pdf}
      enableDoubleTapZoom
      enablePaging
      minScale={0.5}
      maxScale={5}
    />
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
  },
});
