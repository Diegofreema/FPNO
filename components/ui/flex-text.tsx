import { HStack } from '@/components/ui/h-stack';
import { StyleSheet, Text } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const FlexText = ({
  text,
  text2,
  color,
}: {
  text: string;
  text2: string;
  color?: string;
}) => {
  return (
    <HStack
      width={'100%'}
      leftContent={() => (
        <Text style={[styles.text, { color: color || 'black' }]}>{text}</Text>
      )}
      rightContent={() => (
        <Text
          style={[
            styles.text,
            {
              fontFamily: 'NunitoBold',
              textAlign: 'right',
              flex: 1,
              color: color || 'black',
            },
          ]}
        >
          {text2}
        </Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: RFPercentage(1.7),
    fontFamily: 'NunitoRegular',
  },
});
