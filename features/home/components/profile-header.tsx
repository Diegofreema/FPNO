// import { IconBell } from "@tabler/icons-react-native";
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import {Avatar} from '@/components/ui/avatar';
import {HStack} from '@/components/ui/h-stack';
import {colors} from '@/constants';
import {useAuth} from '@/lib/zustand/useAuth';
import {router} from 'expo-router';

export const ProfileHeader = () => {
  const { user } = useAuth();

  const name = user?.name ?? 'N/A'
  const matricNumber = user?.matricnumber ?? 'N/A'!;
  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      leftContent={() => <LeftContent name={name} matric={matricNumber} />}
      rightContent={() => <RightContent />}
      style={{ marginBottom: 10 }}
    />
  );
};

const LeftContent = ({ name, matric }: { name: string; matric: string }) => {
  return (
    <View>
      <Text style={styles.name}>Welcome back, {name}</Text>
      <Text style={styles.matricNumber}>Matric Number: {matric}</Text>
    </View>
  );
};

const RightContent = () => {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      {/*<IconBell color={colors.black} />*/}
      <TouchableOpacity onPress={() => router.push('/profile')}>
        <Avatar />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  name: {
    fontFamily: 'NunitoBold',
    fontSize: RFPercentage(2.2),
    color: colors.black,
  },
  matricNumber: {
    fontFamily: 'NunitoRegular',
    fontSize: RFPercentage(1.7),
    color: colors.black,
  },
});
