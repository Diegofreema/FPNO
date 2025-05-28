import { IconBackspace } from '@tabler/icons-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { colors } from '@/constants';

const dialPads = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'];
const { width } = Dimensions.get('window');
const pinLength = 4;
const pinContainerSize = width / 2;
const pinMaxSize = pinContainerSize / pinLength;
const spacing = 20;
const pinSpacing = 10;
const pinSize = pinMaxSize - pinSpacing * 2;
const dialPadSize = width * 0.18;
const dialPadItemSize = dialPadSize * 0.3;
export const PassCodeForm = () => {
  const { action } = useLocalSearchParams<{ action?: string }>();
  const [code, setCode] = useState<number[]>([]);

  const onPress = (item: (typeof dialPads)[number]) => {
    if (item === 'del' && code.length > 0) {
      setCode((prev) => prev?.slice(0, prev?.length - 1));
    } else if (typeof item === 'number') {
      if (code.length === pinLength) return;
      setCode((prev) => [...prev, item]);
    }
  };
  useEffect(() => {
    const isFilled = code.length === pinLength;
    if (isFilled) {
      setTimeout(() => {
        router.push(`/confirm-passcode?code=${code}&action=${action}`);
        setCode([]);
      }, 500);
    }
  }, [code, action]);

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View style={[styles.pinContainer]}>
        {[...Array(pinLength).keys()].map((i) => {
          const isSelected = code[i] !== undefined && code[i] !== null;
          return (
            <MotiView
              key={i}
              style={[styles.pin]}
              transition={{ type: 'timing', duration: 200 }}
              animate={{
                height: isSelected ? pinSize : 2,
                marginBottom: isSelected ? pinSize / 2 : 0,
              }}
            />
          );
        })}
      </Animated.View>

      <FlatList
        style={{ flexGrow: 0 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        data={dialPads}
        renderItem={({ item }) => (
          <TouchableOpacity
            disabled={item === ''}
            onPress={() => onPress(item)}
          >
            <View
              style={[
                styles.container,
                { borderWidth: item === '' || item === 'del' ? 0 : 1 },
              ]}
            >
              {item === 'del' ? (
                <IconBackspace
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
    </View>
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
    color: colors.black,
  },
  pinContainer: {
    flexDirection: 'row',
    gap: pinSpacing * 2,
    alignItems: 'flex-end',
    marginBottom: spacing * 2,
    height: pinSize * 2,
  },
  pin: {
    width: pinSize,
    height: pinSize,
    borderRadius: pinSize / 2,
    backgroundColor: colors.black,
  },
  resendContainer: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  resend: {
    color: colors.lightblue,
    fontFamily: 'NunitoBold',
  },
});
