import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';

import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';

interface MenuItem {
  text: string;
  onSelect: () => void;
}

interface PopupMenuProps {
  menuItems: MenuItem[];
  disable?: boolean;
  trigger?: React.ReactNode;
}

export const ChatMenu: React.FC<PopupMenuProps> = ({
  menuItems,
  disable,
  trigger,
}) => {
  return (
    <Menu renderer={renderers.ContextMenu}>
      <MenuTrigger
        customStyles={{ triggerTouchable: styles.trigger }}
        disabled={disable}
      >
        {trigger ? (
          trigger
        ) : (
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        )}
      </MenuTrigger>
      <MenuOptions customStyles={menuOptionsStyles}>
        {menuItems.map((item, index) => (
          <MenuOption
            key={index}
            onSelect={item.onSelect}
            text={item.text}
            customStyles={menuOptionStyles}
          />
        ))}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  trigger: {
    padding: 8,
  },
});

const menuOptionsStyles = {
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: 150,
    marginTop: 5,
  },
};

const menuOptionStyles = {
  optionWrapper: {
    padding: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
};
