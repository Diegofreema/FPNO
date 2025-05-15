import { Title } from '@/components/typography/title';
import { Button } from '@/components/ui/button';
import { colors } from '@/constants';
import { ChannelTypeWithPendingMembers } from '@/types';
import { LegendList } from '@legendapp/list';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { RenderRoom } from './render-room';

type Props = {
  channels: ChannelTypeWithPendingMembers[];
  handleLoadMore: () => void;
};

export const RenderRooms = ({ channels, handleLoadMore }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={channels}
        renderItem={({ item }) => <RenderRoom room={item} />}
        keyExtractor={(item) => item.$id}
        onEndReached={handleLoadMore}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
        ListEmptyComponent={EmptyComponent}
      />
    </View>
  );
};

export const EmptyComponent = () => {
  const router = useRouter();
  const onPress = () => {
    router.push('/explore');
  };
  return (
    <View>
      <Title
        text="You are not in any chat room"
        textStyle={{ color: colors.black, textAlign: 'center' }}
      />
      <Button
        text="Explore"
        onPress={onPress}
        style={{ backgroundColor: 'transparent' }}
        textStyle={{ color: colors.lightblue }}
      />
    </View>
  );
};
