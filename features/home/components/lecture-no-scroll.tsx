import { Href } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { SubTitle } from '@/components/typography/subtitle';

import { colors } from '@/constants';
import { LecturesType } from '@/types';
import { EmptyText } from './empty-text';
import { InfoCard } from './info-card';
import { LinkText } from './link-text';

export const LectureNoScroll = ({
  data,
  index,
  link,
  title,
}: {
  data: LecturesType[];
  index: number;
  title?: string;
  link?: Href;
}) => {
  const getSlideDirection = (index: number) => {
    const baseAnimation = index % 2 === 0 ? SlideInLeft : SlideInRight;
    return baseAnimation.springify().damping(80).stiffness(200);
  };

  const SlideDirection = getSlideDirection(index);
  return (
    <Animated.View entering={SlideDirection}>
      <FlatList
        data={data.slice(0, 5)}
        ListHeaderComponent={() =>
          title ? <FlatListHeader text={title} link={link} /> : null
        }
        renderItem={({ item }) => <InfoCard item={item} />}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={() => <EmptyText text="No upcoming lectures" />}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              width: '100%',
              backgroundColor: colors.black,
            }}
          />
        )}
      />
    </Animated.View>
  );
};

const FlatListHeader = ({ text, link }: { text: string; link?: Href }) => {
  return (
    <View
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <SubTitle text={text} textStyle={styles.title} />
      {link && <LinkText text="View all" link={link} />}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: RFPercentage(2.5),
    fontFamily: 'NunitoBold',
    color: colors.black,
  },
  contentContainerStyle: {
    gap: 25,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 20,
    minHeight: 350,
  },
});
