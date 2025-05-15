import React from 'react';
import {
  DimensionValue,
  FlexAlignType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

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
  width?: DimensionValue;
};
export const HStack = ({
  leftContent: LeftContent,
  rightContent: RightContent,
  justifyContent = 'space-between',
  alignItems,
  marginTop = 15,
  gap,
  style,
  width,
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
          width,
        },
        style,
      ]}
    >
      <LeftContent />
      <RightContent />
    </View>
  );
};
