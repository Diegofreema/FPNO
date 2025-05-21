import { colors } from '@/constants';
import { useAuth } from '@/lib/zustand/useAuth';
import { ReplyType } from '@/types';
import { Image } from 'expo-image';
import React, { ReactNode } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';

type Props = {
  message?: ReplyType;
};
const { width } = Dimensions.get('window');
export const RenderReply = ({ message }: Props) => {
  const loggedInUserId = useAuth((state) => state.user?.id!);

  if (!message) return null;
  const displayName =
    loggedInUserId === message.user.id ? 'You' : message.user.name;
  const renderContent = () => {
    if (message?.fileType === 'image' && message.fileUrl) {
      return (
        <DisplayReply
          name={displayName}
          content={
            <Image
              source={{ uri: message.fileUrl }}
              style={styles.file}
              placeholder={require('@/assets/images/place.webp')}
              placeholderContentFit="cover"
              contentFit="cover"
            />
          }
        />
      );
    } else if (message?.fileType === 'pdf' && message.fileUrl) {
      return (
        <DisplayReply
          name={displayName}
          content={
            <Pdf
              source={{ uri: message.fileUrl }}
              style={styles.file}
              singlePage
            />
          }
        />
      );
    } else {
      return (
        <DisplayReply
          name={displayName}
          flexDirection={'column'}
          content={
            <Text style={styles.text} numberOfLines={5}>
              {message?.message?.length > 40
                ? message?.message?.substring(0, 40) + '...'
                : message?.message}
            </Text>
          }
        />
      );
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

type DisplayProps = {
  name: string;
  content: ReactNode;
  flexDirection?: 'row' | 'column';
};

const DisplayReply = ({
  content,
  name,
  flexDirection = 'row',
}: DisplayProps) => {
  return (
    <View
      style={{
        flexDirection,
        justifyContent: 'space-between',
        minWidth: width * 0.25,
      }}
    >
      <Text
        style={{
          color: '#89BC0C',
          paddingLeft: 10,
          paddingTop: 5,
          fontWeight: '600',
          fontSize: 12,
        }}
      >
        {name}
      </Text>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  file: {
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  text: {
    color: colors.gray,
    paddingLeft: 10,
    paddingTop: 5,
    fontSize: 15,
    marginBottom: 5,
  },
  container: {
    flexDirection: 'column',
    height: '100%',
    maxHeight: width * 0.15,
    backgroundColor: 'rgba(204, 204, 204, 0.8)',
    borderRadius: 6,
    paddingHorizontal: 3,
  },
});
