import { Avatar } from '@/components/ui/avatar';
import { HStack } from '@/components/ui/h-stack';
import { colors } from '@/constants';
import { UserType } from '@/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

type Props = {
  user: UserType;
};

export const User = ({ user }: Props) => {
  return (
    <TouchableOpacity activeOpacity={0.7}>
      <HStack
        justifyContent="flex-start"
        alignItems="center"
        gap={10}
        leftContent={() => <Avatar imgSrc={user.image_url} size={50} />}
        rightContent={() => (
          <Right name={user.name} matric={user.matriculation_number} />
        )}
      />
    </TouchableOpacity>
  );
};

const Right = ({ name, matric }: { name: string; matric?: string }) => {
  return (
    <View style={{ gap: 5 }}>
      <Text style={{ fontSize: RFPercentage(1.6), fontWeight: 'bold' }}>
        {name}
      </Text>
      {matric && (
        <Text style={{ fontSize: RFPercentage(1.4), color: colors.textGray }}>
          {matric}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
