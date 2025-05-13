import { Avatar } from '@/components/ui/avatar';
import { colors } from '@/constants';
import { ImageBackground } from 'expo-image';
import { MotiView } from 'moti';
import { PropsWithChildren } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

export const ProfileBackground = ({ children }: PropsWithChildren) => {
  const { height } = useWindowDimensions();

  return (
    <ImageBackground
      style={styles.container}
      contentFit="cover"
      source={require('@/assets/images/bg.png')}
    >
      <MotiView
        from={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 500 }}
        style={[styles.imgContainer, { top: height * 0.23 }]}
      >
        <Avatar size={'100%'} />
      </MotiView>
      <View style={{ zIndex: 3, marginTop: 50, flex: 1 }}>
        <View
          style={{
            height: height * 0.2,
            width: '100%',
            marginBottom: 20,
          }}
        />

        <View
          style={{
            flex: 1,
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            overflow: 'hidden',
            zIndex: 3,
          }}
        >
          {children}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  abs: {
    backgroundColor: '#2b4875',
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    opacity: 0.8,
  },
  img: {
    width: '100%',
    height: '100%',
    zIndex: 5,
  },
  imgContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: colors.white,
    alignSelf: 'center',
    position: 'absolute',

    zIndex: 10,
  },
});
