import { colors } from '@/constants';
import { Image } from 'expo-image';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  imagePaths: string[];
  setIsAttachImage: (isAttachImage: boolean) => void;
  setImagePaths: (imagePaths: string[]) => void;
  height: SharedValue<number>;
};

export const ChatFooter = ({
  imagePaths,
  setIsAttachImage,
  setImagePaths,
  height,
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => ({
    height: withSpring(height.value, {
      damping: 80,
      stiffness: 200,
    }),
  }));
  return (
    <Animated.View style={animatedStyle}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chatFooter}
      >
        {imagePaths.length > 0 &&
          imagePaths.map((image, i) => (
            <View key={i}>
              <Image
                source={{ uri: image }}
                style={{ height: 75, width: 75 }}
              />
              <TouchableOpacity
                onPress={() => {
                  if (imagePaths.length === 1) {
                    setIsAttachImage(false);
                  }
                  setImagePaths(imagePaths.filter((_, index) => i !== index));
                }}
                style={styles.buttonFooterChatImg}
              >
                <Text style={styles.textFooterChat}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chatFooter: {
    shadowColor: '#1F2687',
    flexGrow: 1,
    shadowOpacity: 0.37,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: colors.lightblue,
    gap: 10,
  },
  buttonFooterChat: {
    width: 20,
    height: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    right: 3,
    top: -2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 2,
  },
  buttonFooterChatImg: {
    width: 25,
    height: 25,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    left: 55,
    top: -4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 5,
  },
  textFooterChat: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'gray',
  },
});
