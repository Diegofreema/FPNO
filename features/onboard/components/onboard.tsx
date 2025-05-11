import { StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { colors } from '@/constants';
import { onboardData } from '@/features/onboard/data';
import { useIsFirst } from '@/lib/zustand/useIsFirst';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import Animated, { FlipInEasyX, FlipOutEasyX } from 'react-native-reanimated';
import { ActionButton } from './action-button';
import { Indicators } from './indicators';

export const Onboard = () => {
  const [active, setActive] = useState(0);
  const { setIsFirstToFalse } = useIsFirst();
  const router = useRouter();
  const dataToShow = onboardData[active];
  const onSkip = () => {
    setIsFirstToFalse();
    router.replace('/login');
  };

  const onNext = () => {
    if (active === 2) {
      setIsFirstToFalse();
      router.replace('/login');
    } else {
      setActive((prev) => prev + 1);
    }
  };

  const isLast = active === 2;
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.Image
        source={dataToShow.image}
        style={styles.img}
        entering={FlipInEasyX}
        exiting={FlipOutEasyX}
        key={active + 1}
      />
      <View style={styles.textContainer}>
        <Indicators currentIndex={active} onSkip={onSkip} />
        <Animated.Text style={styles.text}>{dataToShow.text}</Animated.Text>
        <Animated.Text style={[styles.text, styles.subText]}>
          {dataToShow.subText}
        </Animated.Text>
        <ActionButton onNext={onNext} isLast={isLast} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  img: {
    flex: 0.55,
    width: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    backgroundColor: colors.white,
    paddingTop: 10,
    paddingHorizontal: 20,
    flex: 0.45,
  },
  text: {
    color: colors.black,
    fontSize: RFPercentage(3),
    fontFamily: 'NunitoBold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: RFPercentage(2),
    fontFamily: 'NunitoRegular',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  indicator: {
    width: 10,
    height: 6,
    borderRadius: 8,
    backgroundColor: 'lightgray',
  },
  indicatorView: {
    flexDirection: 'row',
    gap: 10,
  },
});
