import { SubTitle } from '@/components/typography/subtitle';
import { Avatar } from '@/components/ui/avatar';
import { CustomPressable } from '@/components/ui/custom-pressable';
import { colors } from '@/constants';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

type Props = {
  imageUrl: string;
  name: string;
  subText?: string;
};

export const ChatNav = ({ imageUrl, name, subText }: Props) => {
  const router = useRouter();
  const onPress = () => {
    router.back();
  };
  return (
    <View style={styles.container}>
      <CustomPressable onPress={onPress} style={styles.press}>
        <AntDesign name="arrowleft" color={colors.black} size={25} />
        <Avatar imgSrc={imageUrl} size={50} />
        <View>
          <SubTitle
            text={name}
            textStyle={{
              fontFamily: 'NunitoRegular',
              fontSize: RFPercentage(2.5),
              color: colors.black,
            }}
          />
          {subText && (
            <SubTitle
              text={subText}
              textStyle={{
                fontFamily: 'NunitoLight',
                fontSize: RFPercentage(1.5),
                color: colors.gray,
              }}
            />
          )}
        </View>
      </CustomPressable>

      <CustomPressable>
        <AntDesign name="ellipsis1" color={colors.black} size={25} />
      </CustomPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
    gap: 7,
  },
  press: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});
