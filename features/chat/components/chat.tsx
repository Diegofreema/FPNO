import { CustomPressable } from '@/components/ui/custom-pressable';
import { colors } from '@/constants';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatHeader } from './chat-header';
import { SearchInput } from './search-converstion';

const options = ['Single', 'Group'];
export const Chat = () => {
  const [value, setValue] = useState('');
  const [selectedTab, setSelectedTab] = useState('Single');
  return (
    <View style={{ gap: 10 }}>
      <ChatHeader />
      <View style={{ flexDirection: 'row', gap: 15 }}>
        {options.map((option) => {
          const isActive = option === selectedTab;
          return (
            <CustomPressable
              key={option}
              style={[styles.press, isActive && styles.pressActive]}
              onPress={() => setSelectedTab(option)}
            >
              <Text style={[styles.text, isActive && styles.activeText]}>
                {option}
              </Text>
            </CustomPressable>
          );
        })}
      </View>
      <SearchInput
        placeholder="Search conversations"
        value={value}
        onChangeText={setValue}
      />
      <Text>chat</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    backgroundColor: colors.white,
    padding: 5,
    marginTop: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'NunitoRegular',
    fontSize: 15,
  },
  press: {
    borderWidth: 1,
    borderColor: colors.lightblue,
    borderRadius: 20,
    padding: 10,
  },
  pressActive: {
    backgroundColor: colors.lightblue,
  },
  activeText: {
    color: colors.white,
  },
  text: {
    fontFamily: 'NunitoRegular',
  },
});
