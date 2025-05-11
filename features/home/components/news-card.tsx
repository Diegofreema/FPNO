import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants';
import { trimText } from '@/helper';
import { useNotice } from '@/lib/zustand/useNotice';
import { NewsTypes } from '@/types';
import { AntDesign } from '@expo/vector-icons';
import { format, parse } from 'date-fns';
import { router } from 'expo-router';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const NewsCard = ({ item }: { item: NewsTypes }) => {
  const dateString = item?.date1;
  const getDetail = useNotice((state) => state.getDetail);
  // 1. Parse the specific format first
  const parsedDate = parse(dateString, 'M/d/yyyy h:mm:ss a', new Date());

  const date = format(parsedDate, 'PP');
  const onPress = () => {
    getDetail({ date1: date, heading: item.heading, messages: item.messages });
    router.push('/detail');
  };
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={{ marginBottom: 5 }}
      onPress={onPress}
    >
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.heading}</Text>
            <Text style={styles.subText}>{trimText(item.messages, 200)}</Text>
          </View>
        </View>
      </View>
      <View
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
          {date}
        </Text>
      </View>
    </TouchableOpacity>
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
    color: colors.lightblue,

    marginBottom: 10,
  },
  subText: {
    fontSize: RFPercentage(1.5),
    color: colors.textGray,
    fontFamily: 'NunitoRegular',
  },
});
