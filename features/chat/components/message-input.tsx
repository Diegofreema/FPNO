import { colors } from '@/constants';
import React from 'react';
import { Composer, ComposerProps } from 'react-native-gifted-chat';

import { CustomPressable } from '@/components/ui/custom-pressable';
import { IconCamera } from '@tabler/icons-react-native';
import { View } from 'react-native';

type Props = ComposerProps & {
  onPickImage: () => void;
};
export const RenderComposer = ({ onPickImage, ...props }: Props) => {
  return (
    <View
      style={{
        borderWidth: 0.5,
        borderColor: colors.lightblue,
        borderRadius: 5,
        height: 50,
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Composer {...props} multiline />
      <CustomPressable onPress={onPickImage}>
        <IconCamera size={24} color={colors.lightblue} strokeWidth={1.5} />
      </CustomPressable>
    </View>
  );
};
