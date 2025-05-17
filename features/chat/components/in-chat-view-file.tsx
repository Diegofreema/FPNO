import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Pdf from 'react-native-pdf';

type Props = {
  uri: string;
  visible: boolean;
  onClose: () => void;
};
export function InChatViewFile({ uri, visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      style={{ height: 600 }}
    >
      <View style={{ padding: 20, height: 100, width: 100 }}>
        <Pdf source={{ uri }} style={{ height: '100%', width: '100%' }} />
        <TouchableOpacity onPress={onClose} style={styles.buttonCancel}>
          <Text style={styles.textBtn}>X</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  buttonCancel: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    left: 13,
    top: 20,
  },
  textBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});
