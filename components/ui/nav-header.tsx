import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { SubTitle } from '@/components/typography/subtitle';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';

type NavHeaderProps = {
  title: string;
  style?: StyleProp<ViewStyle>;
  leftContent?: () => React.JSX.Element;
  avatarContent?: React.JSX.Element;
  color?: string;
  onPress?: () => void;
};
export const NavHeader = ({
  title,
  leftContent: LeftContent,
  style,
  avatarContent: AvatarContent,
  color = 'black',
  onPress: handlePress,
}: NavHeaderProps) => {
  const onPress = (): void => {
    handlePress && handlePress();
    router.back();
  };
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          zIndex: 4,
          alignItems: 'center',
          gap: 7,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{ padding: 5, flexDirection: 'row', alignItems: 'center' }}
      >
        <AntDesign name="arrowleft" color={color} size={25} />
        {AvatarContent && AvatarContent}
      </TouchableOpacity>
      <SubTitle
        text={title}
        textStyle={{
          fontFamily: 'NunitoBold',
          fontSize: RFPercentage(2.5),
          color: color,
        }}
      />
      {LeftContent ? (
        <LeftContent />
      ) : (
        <View style={{ width: 50, height: 50 }} />
      )}
    </View>
  );
};
