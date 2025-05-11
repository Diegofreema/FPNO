import { Title } from '@/components/typography/title';
import { Button } from '@/components/ui/button';
import { colors } from '@/constants';
import { StyleSheet, View } from 'react-native';

export const ErrorComponent = ({
  onPress,
  title = 'Something went wrong',
  height,
  btnText = 'Retry',
  onGoBack,
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
      <Title text={title} textStyle={{ color: 'black', textAlign: 'center' }} />
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          marginHorizontal: 'auto',
          gap: 10,
        }}
      >
        {onGoBack && (
          <Button
            text="Cancel"
            onPress={onGoBack}
            style={{
              backgroundColor: colors.red,
              justifyContent: 'center',
              flex: 1,
            }}
            textStyle={{ color: colors.white }}
          />
        )}
        <Button
          text={btnText}
          onPress={onPress}
          style={{
            backgroundColor,
            justifyContent: 'center',
            flex: 1,
          }}
          textStyle={{ color: textColor }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 200,

    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
