import { colors, spacing } from '@/constants';
import { LecturesType } from '@/types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedListCard = ({
  item,
  viewableItems,
}: {
  item: LecturesType;
  viewableItems: SharedValue<ViewToken[]>;
}) => {
  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((item) => item.isViewable)
        .find((viewableItem) => viewableItem.item.id === item.timetableid)
    );

    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.6),
        },
      ],
    };
  }, []);
  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.8}
      style={[styles.outerContainer, rStyle]}
    >
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.lecturer}</Text>
            <Text style={styles.subText}>{item.coursecode}</Text>
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.subText,
              { fontSize: RFPercentage(1.4), textAlign: 'right' },
            ]}
          >
            {item.Hall}
          </Text>
          <Text
            style={[
              styles.subText,
              { fontSize: RFPercentage(1.4), textAlign: 'right' },
            ]}
          >
            {item.coursecode}
          </Text>
        </View>
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginTop: 5,
        }}
      >
        <Text style={[styles.subText, { fontSize: RFPercentage(2) }]}>
          {item.coursecode}
        </Text>
        <Text style={[styles.subText, { fontSize: RFPercentage(2) }]}>
          {item.coursecode}
        </Text>
      </View>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
  },
  title: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'NunitoBold',
    lineHeight: 20,
  },
  subText: {
    fontSize: RFPercentage(1.5),
    color: colors.textGray,
    fontFamily: 'NunitoRegular',
  },
  outerContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    padding: spacing,
    borderRadius: 5,
    marginBottom: 5,
  },
});
