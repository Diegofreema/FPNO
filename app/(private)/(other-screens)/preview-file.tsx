import {PreviewDoc} from '@/features/chat-room/components/preview-doc';
import {PreviewChatImage} from '@/features/chat-room/components/preview-image';
import {useFileUrlStore} from '@/hooks/use-file-url';
import React from 'react';
import {View} from 'react-native';
import {Stack} from "expo-router";

const PreviewFile = () => {
  const file = useFileUrlStore((state) => state.file);


  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Preview',
          headerBackTitle: 'Back',

        }}

      />
      {file?.type === 'image' ? (
        <PreviewChatImage url={file.url} />
      ) : (
        <PreviewDoc uri={file?.url!} />
      )}
    </View>
  );
};

export default PreviewFile;
