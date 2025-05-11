import { colors } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Dot } from './dot';

export const Indicators = ({
  currentIndex,
  onSkip,
}: {
  currentIndex: number;
  onSkip: () => void;
}) => {
  return (
    <View style={styles.indicatorContainer}>
      <View style={styles.indicatorView}>
        {[...Array(3).keys()].map((_, i) => {
          const isCurrent = currentIndex === i;
          return <Dot key={i} isCurrent={isCurrent} />;
        })}
      </View>
      <TouchableOpacity onPress={onSkip}>
        <Text
          style={{
            color: colors.lightblue,
            fontFamily: 'NunitoBold',
            fontSize: RFPercentage(1.7),
          }}
        >
          Skip
        </Text>
      </TouchableOpacity>
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
