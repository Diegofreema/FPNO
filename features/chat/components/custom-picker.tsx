import { Picker as AndroidPicker } from '@expo/ui/jetpack-compose';
import { Picker } from '@expo/ui/swift-ui';
import React from 'react';
import { Platform, Text, View } from 'react-native';

type Props = {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  options: string[];
};

export const CustomPicker = ({
  selectedIndex,
  setSelectedIndex,
  options,
}: Props) => {
  console.log(Platform.OS);

  if (Platform.OS === 'android') {
    return (
      <AndroidPicker
        options={options}
        selectedIndex={selectedIndex}
        onOptionSelected={({ nativeEvent: { index } }) => {
          setSelectedIndex(index);
        }}
      />
    );
  }
  if (Platform.OS === 'ios') {
    return (
      <View>
        <Text>Custom Picker</Text>
        <Picker
          options={options}
          selectedIndex={selectedIndex}
          onOptionSelected={({ nativeEvent: { index } }) => {
            setSelectedIndex(index);
          }}
        />
      </View>
    );
  }
};
