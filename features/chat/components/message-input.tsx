import { colors } from '@/constants';
import React from 'react';
import { Composer, ComposerProps } from 'react-native-gifted-chat';

import { View } from 'react-native';
import { FilePickerPanel } from './file-picker-panel';

type Props = ComposerProps & {
  onPickImage: () => void;
  showFilePicker: boolean;
  onPickDocument: () => void;
  onClose: () => void;
  onOpenCamera: () => void;
};
export const RenderComposer = ({
  onPickImage,
  onPickDocument,
  onClose,
  showFilePicker,
  onOpenCamera,
  ...props
}: Props) => {
  return (
    <>
      <FilePickerPanel
        onClose={onClose}
        visible={showFilePicker}
        onPickDocument={onPickDocument}
        onPickImage={onPickImage}
      />
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
        {/* <CustomPressable onPress={onOpenCamera}>
          <IconCamera size={24} color={colors.lightblue} strokeWidth={1.5} />
        </CustomPressable> */}
      </View>
    </>
  );
};
