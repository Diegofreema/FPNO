import { trimText } from '@/helper';
import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

export const InChatFileTransfer = ({
  filePath,
  style,
}: {
  filePath: string;
  style?: StyleProp<ViewStyle>;
}) => {
  let fileType = '';
  let name = '';
  if (filePath !== undefined) {
    name = filePath.split('/').pop() as string;
    fileType = filePath.split('.').pop() as string;
  }
  return (
    <View style={[styles.frame, style]}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={
            fileType === 'pdf'
              ? require('@/assets/chat_file.png')
              : require('@/assets/unknowFile.png')
          }
          style={{ height: 50, width: 50 }}
        />
      </View>
      <View>
        <Text style={styles.text}>
          {trimText(name.replace(/%20/g, ' ').replace(' ', ''), 15)}
        </Text>
        {/*<Text style={styles.textType}>{fileType.toUpperCase()}</Text>*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  textType: {
    color: 'black',
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  frame: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 10,
    gap: 5,
    width: 200,
    height: '100%',
    alignItems: 'center',
  },
});
