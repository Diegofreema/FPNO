import { colors } from '@/constants';
import { StyleSheet } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const Dot = ({ isCurrent }: { isCurrent: boolean }) => {
  return (
    <Animated.View
      layout={LinearTransition.springify().damping(80).stiffness(200)}
      style={[
        styles.indicator,
        {
          backgroundColor: isCurrent ? colors.lightblue : 'lightgray',
          width: isCurrent ? 20 : 10,
        },
      ]}
    />
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
