import {Feather} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {colors} from "@/constants";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

export const SearchInput = ({ onChangeText, placeholder, value }: Props) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={24} color="black" />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.textInput}
        placeholderTextColor={'#ccc'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    borderColor: 'transparent',
    color: colors.black
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
});
