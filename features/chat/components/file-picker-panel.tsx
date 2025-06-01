import {colors} from '@/constants';
import {File, ImageIcon} from 'lucide-react-native';
import {AnimatePresence, View} from 'moti';
import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';

interface FilePickerPanelProps {
  visible: boolean;
  onClose: () => void;
  onPickImage: () => void;
  onPickDocument: () => void;
}

const { width } = Dimensions.get('window');

export const FilePickerPanel: React.FC<FilePickerPanelProps> = ({
  visible,
  onClose,
  onPickImage,
  onPickDocument,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <View
          from={{ opacity: 0, translateY: 100 }}
          animate={{ opacity: 1, translateY: 50 }}
          exit={{ opacity: 0, translateY: 100 }}
          exitTransition={{
            type: 'timing',
            duration: 500,
          }}
          style={styles.overlay}
        >
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={1}
            disabled={!visible}
          >
            <View style={[styles.panel]}>
              <View>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => {
                    onPickImage();
                    onClose();
                  }}
                  accessibilityLabel="Pick an image from gallery"
                >
                  <ImageIcon size={24} color="#25D366" />
                </TouchableOpacity>
                <Text style={styles.text}>Image</Text>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => {
                    onPickDocument();
                    onClose();
                  }}
                  accessibilityLabel="Pick a PDF document"
                >
                  <File size={24} color="#25D366" />
                </TouchableOpacity>
                <Text style={styles.text}>Pdf</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,

    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  panel: {
    position: 'absolute',
    bottom: 70, // Position above input field
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: width - 32,
  },
  iconButton: {
    padding: 10,
    backgroundColor: colors.lightblue,
    borderRadius: 8,
  },
  text: {
    textAlign: 'center',
    color: colors.black
  },
});
