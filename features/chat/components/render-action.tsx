import React from 'react';
import { Actions, ActionsProps } from 'react-native-gifted-chat';

import { CustomPressable } from '@/components/ui/custom-pressable';
import { colors } from '@/constants';
import { IconPaperclip } from '@tabler/icons-react-native';

type Props = ActionsProps & {
  onPickDocument: () => void;
  disable: boolean;
};

export const RenderActions = ({ onPickDocument, disable, ...props }: Props) => {
  return (
    <Actions
      {...props}
      icon={() => (
        <CustomPressable onPress={onPickDocument} disabled={disable}>
          <IconPaperclip size={24} color={colors.lightblue} />
        </CustomPressable>
      )}
      containerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        marginRight: 5,
      }}
    />
  );
};
