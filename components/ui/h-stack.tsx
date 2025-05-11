import React from 'react';
import { FlexAlignType, StyleProp, View, ViewStyle } from 'react-native';

type HStackProps = {
  justifyContent?:
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'flex-start'
    | 'flex-end'
    | undefined;
  alignItems?: FlexAlignType | undefined;
  leftContent: () => React.JSX.Element | null;
  rightContent: () => React.JSX.Element;
  marginTop?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};
export const HStack = ({
  leftContent: LeftContent,
  rightContent: RightContent,
  justifyContent = 'space-between',
  alignItems,
  marginTop = 15,
  gap,
  style,
}: HStackProps) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent,
          alignItems,
          marginTop,
          gap,
          width: '100%',
        },
        style,
      ]}
    >
      <LeftContent />
      <RightContent />
    </View>
  );
};
