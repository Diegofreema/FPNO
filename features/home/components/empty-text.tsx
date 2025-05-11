import { Title } from '@/components/typography/title';
import { View } from 'react-native';

export const EmptyText = ({ text }: { text: string }) => {
  return (
    <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
      <Title text={text} textStyle={{ color: 'black', textAlign: 'center' }} />
    </View>
  );
};
