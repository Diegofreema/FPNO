import { colors } from '@/constants';
import { IMessage } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Pdf from 'react-native-pdf';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

type ReplyMessageBarProps = {
  clearReply: () => void;
  message: IMessage | null;
};

const ReplyMessageBar = ({ clearReply, message }: ReplyMessageBarProps) => {
  const renderContent = () => {
    if (message?.fileType === 'image' && message.fileUrl) {
      return (
        <Image
          source={{ uri: message.fileUrl }}
          style={{ width: 40, height: 40, marginLeft: 10 }}
          placeholder={require('@/assets/images/place.webp')}
          placeholderContentFit="cover"
          contentFit="cover"
        />
      );
    } else if (message?.fileType === 'pdf' && message.fileUrl) {
      return (
        <Pdf source={{ uri: message.fileUrl }} style={styles.pdf} singlePage />
      );
    } else {
      return (
        <Text style={{ color: colors.gray, paddingLeft: 10, paddingTop: 5 }}>
          {message!.text.length > 40
            ? message?.text.substring(0, 40) + '...'
            : message?.text}
        </Text>
      );
    }
  };
  const height =
    message?.fileType === 'image' || message?.fileType === 'pdf' ? 70 : 50;
  return (
    <>
      {message !== null && (
        <Animated.View
          style={{
            height: height,
            flexDirection: 'row',
            backgroundColor: '#E4E9EB',
          }}
          entering={FadeInDown}
          exiting={FadeOutDown}
        >
          <View
            style={{ height: height, width: 6, backgroundColor: '#89BC0C' }}
          ></View>
          <View style={{ flexDirection: 'column' }}>
            <Text
              style={{
                color: '#89BC0C',
                paddingLeft: 10,
                paddingTop: 5,
                fontWeight: '600',
                fontSize: 15,
              }}
            >
              {message?.user.name}
            </Text>

            {renderContent()}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingRight: 10,
            }}
          >
            <TouchableOpacity onPress={clearReply}>
              <Ionicons
                name="close-circle-outline"
                color={colors.lightblue}
                size={28}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default ReplyMessageBar;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
  sentText: {
    color: colors.white,
  },
  receivedText: {
    color: '#000',
  },
  sentTextContainer: {
    backgroundColor: colors.lightblue,
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  receivedTextContainer: {
    backgroundColor: colors.lightGray,
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  sentImage: {
    borderBottomRightRadius: 2,
  },
  receivedImage: {
    borderBottomLeftRadius: 2,
  },
  pdfContainer: {
    width: 200,
    height: 200,
  },
  pdf: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginLeft: 10,
  },
});
