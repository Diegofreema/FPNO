import { NavHeader } from '@/components/ui/nav-header';
import { ScrollWrapper } from '@/components/ui/wrapper';
import { colors } from '@/constants';
import { useNotice } from '@/lib/zustand/useNotice';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  SlideInDown,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Detail = () => {
  const item = useNotice((state) => state.detail);
  const { top } = useSafeAreaInsets();
  return (
    <ScrollWrapper styles={{ backgroundColor: 'white', marginTop: top }}>
      <NavHeader title={'Notice detail'} />

      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={{ flex: 1 }}>
            <Animated.Text
              entering={SlideInLeft.springify().damping(80).stiffness(200)}
              style={styles.title}
            >
              {item.heading}
            </Animated.Text>
            <Animated.Text
              entering={SlideInRight.springify().damping(80).stiffness(200)}
              style={styles.subText}
            >
              {item.messages}
            </Animated.Text>
          </View>
        </View>
      </View>
      <Animated.View
        entering={SlideInDown.springify().damping(80).stiffness(200)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          justifyContent: 'flex-end',
        }}
      >
        <AntDesign name="calendar" size={20} color={colors.lightblue} />
        <Text
          style={[
            styles.subText,
            { fontSize: RFPercentage(1.4), textAlign: 'right' },
          ]}
        >
          {item.date1}
        </Text>
      </Animated.View>
    </ScrollWrapper>
  );
};
export default Detail;
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
    fontSize: RFPercentage(2.4),
    fontFamily: 'NunitoBold',
    color: colors.lightblue,
    marginBottom: 20,
  },
  subText: {
    fontSize: RFPercentage(1.7),
    color: colors.textGray,
    fontFamily: 'NunitoRegular',
  },
});
