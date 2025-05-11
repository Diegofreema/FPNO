import { Image, ImageBackground } from 'expo-image';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SubTitle } from '../typography/subtitle';
import { Title } from '../typography/title';

type Props = {
  text: string;
  text2: string;
};
export const CustomBackgroundImage = ({
  text2,
  text,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <ImageBackground
      style={styles.container}
      contentFit="cover"
      source={require('@/assets/images/bg.png')}
    >
      <View style={{ zIndex: 3, marginTop: 50, flex: 1 }}>
        <View
          style={{
            flex: 0.25,
            width: '100%',
            paddingHorizontal: 15,
            marginBottom: 20,
            gap: 10,
            marginTop: 10,
          }}
        >
          <Image
            source={require('@/assets/images/logo.png')}
            contentFit="contain"
            style={{ height: 60, width: 200 }}
          />
          <Title text={text} />
          <SubTitle text={text2} />
        </View>
        <View
          style={{
            flex: 0.75,
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            overflow: 'hidden',
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
});
