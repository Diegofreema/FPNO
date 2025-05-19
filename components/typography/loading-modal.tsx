import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

// Fallback colors in case constants are unavailable
const COLORS = {
  lightblue: '#007AFF', // iOS blue as fallback
  white: '#FFFFFF',
  shadow: '#000000',
};

// Type definition for props
interface LoadingModalProps {
  visible: boolean;
  color?: string; // Optional color prop for flexibility
}

// LoadingModal component
export const LoadingModal: React.FC<LoadingModalProps> = ({
  visible,
  color = COLORS.lightblue,
}) => {
  if (!visible) return null; // Early return for performance

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      accessible={true}
      accessibilityLabel="Loading modal"
      accessibilityRole="alert"
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size="large" color={color} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  modalView: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
