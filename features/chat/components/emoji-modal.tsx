import { colors } from '@/constants';
import { emojis } from '@/data';
import { MessageReactionsType } from '@/types';
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface EmojiPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  position?: { top: number; left: number }; // Position above the bubble
  findEmojiISelected: MessageReactionsType | undefined;
}

// WhatsApp-like emojis

export const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  findEmojiISelected,
  position = { top: 0, left: 0 },
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      accessible
      accessibilityLabel="Emoji reaction picker"
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <View
          style={[
            styles.pickerContainer,
            { top: position.top, left: position.left },
          ]}
        >
          {emojis.map((emoji) => {
            const isSelected = findEmojiISelected?.emoji === emoji.value;
            return (
              <TouchableOpacity
                key={emoji.value}
                style={[styles.emojiButton, isSelected && styles.selected]}
                onPress={() => {
                  onSelect(emoji.value);
                  onClose();
                }}
                accessibilityLabel={`React with ${emoji.emoji}`}
              >
                <Text style={styles.emoji}>{emoji.emoji}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent overlay
  },
  pickerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: width - 32,
  },
  emojiButton: {
    padding: 8,
  },
  emoji: {
    fontSize: 24,
  },
  selected: {
    backgroundColor: colors.lightblue,
    borderRadius: 10,
  },
});
