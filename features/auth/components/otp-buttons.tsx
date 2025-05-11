import { colors, dialPadItemSize, dialPadSize, spacing } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  dialPads: (string | number)[];
  onPress: (item: string | number) => void;
};

export const OtpButtons = ({ dialPads, onPress }: Props) => {
  return (
    <FlatList
      style={{ flexGrow: 0 }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      data={dialPads}
      renderItem={({ item }) => (
        <TouchableOpacity disabled={item === ''} onPress={() => onPress(item)}>
          <View
            style={[
              styles.container,
              { borderWidth: item === '' || item === 'del' ? 0 : 1 },
            ]}
          >
            {item === 'del' ? (
              <Ionicons
                name="backspace"
                color={colors.black}
                size={dialPadItemSize * 2}
                strokeWidth={1}
              />
            ) : (
              <Text style={styles.text}>{item}</Text>
            )}
          </View>
        </TouchableOpacity>
      )}
      numColumns={3}
      contentContainerStyle={{ gap: spacing, paddingBottom: 100 }}
      columnWrapperStyle={{ gap: spacing }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: dialPadSize,
    height: dialPadSize,
    borderRadius: dialPadSize,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: dialPadItemSize,
    fontFamily: 'NunitoRegular',
  },
});
