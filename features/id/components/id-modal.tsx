import { useStoreId } from '@/lib/zustand/useStoreId';
import { StyleSheet, View } from 'react-native';

import { Image } from 'expo-image';

import { RFPercentage } from 'react-native-responsive-fontsize';

import { colors } from '@/constants';

import { Title } from '@/components/typography/title';
import { Avatar } from '@/components/ui/avatar';
import { FlexText } from '@/components/ui/flex-text';
import { getStudentData } from '@/helper';
import { useAuth } from '@/lib/zustand/useAuth';
import { Barcode } from './barcode';

export const IDModal = () => {
  const details = useStoreId((state) => state.details);
  const data = useAuth((state) => state.user);
  console.log({ details, data });
  const studentDetails = getStudentData(data!);
  const fullName = `${studentDetails?.fname} ${studentDetails?.lname}`;
  return (
    <View style={styles.modal}>
      <View style={styles.top}>
        <Image
          contentFit="contain"
          source={require('@/assets/images/logo.png')}
          style={{ width: 200, height: 60 }}
        />
        <Title
          text="Federal Polytechnic Nekede"
          textStyle={{ color: 'black', fontSize: RFPercentage(2.5) }}
        />
        <View style={styles.avatar}>
          <Avatar size={100} />
        </View>
      </View>
      <View
        style={{
          marginTop: 100,
          gap: 10,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <FlexText color="white" text="Full name" text2={fullName} />
        <FlexText
          color="white"
          text="Matric Number"
          text2={studentDetails?.matricnumber!}
        />
        <FlexText
          color="white"
          text="Department"
          text2={studentDetails?.Department!}
        />
        <FlexText
          color="white"
          text="Program"
          text2={studentDetails?.programtype!}
        />
        {/*<FlexText color="white" text="Expiring Date" text2={details.exp} />*/}
        <FlexText
          color="white"
          text="Matric Number"
          text2={studentDetails?.matricnumber!}
        />
        <FlexText
          color="white"
          text="Faculty"
          text2={studentDetails?.Faculty!}
        />
      </View>
      <Barcode />
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 5,
    backgroundColor: colors.lightblue,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 500,
    overflow: 'hidden',
    paddingBottom: 20,
  },

  avatar: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'white',
    marginVertical: 20,
    borderRadius: 100,
    padding: 15,
    marginBottom: -50,
  },
  top: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    paddingTop: 20,
    borderBottomRightRadius: 100,
  },
});
