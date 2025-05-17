import { Button } from '@/components/ui/button';
import { colors } from '@/constants';
import { StyleSheet, Text, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const ErrorComponent = ({
  onPress,
  title = 'Something went wrong',
  height,
  btnText = 'Retry',
  textColor = colors.lightblue,
  backgroundColor = 'transparent',
}: {
  onPress: () => void;
  onGoBack?: () => void;
  title?: string;
  height?: number;
  btnText?: string;
  backgroundColor?: string;
  textColor?: string;
}) => {
  return (
    <View style={[styles.container, { height }]}>
      <Text
        style={{
          color: 'black',
          fontSize: RFPercentage(3),
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Button
        text={btnText}
        onPress={onPress}
        style={{
          backgroundColor,
          justifyContent: 'center',
        }}
        textStyle={{ color: textColor }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
