import { Title } from '@/components/typography/title';
import { Button } from '@/components/ui/button';
import { colors } from '@/constants';
import { ChannelTypeWithPendingMembers } from '@/types';
import { LegendList } from '@legendapp/list';
import { Href, usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';
import { RenderRoom } from './render-room';

type Props = {
  channels: ChannelTypeWithPendingMembers[];
  handleLoadMore: () => void;
  refresh: () => void;
  isRefreshing: boolean;
};

export const RenderRooms = ({
  channels,
  handleLoadMore,
  refresh,
  isRefreshing,
}: Props) => {
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
        onRefresh={refresh}
        refreshing={isRefreshing}
      />
    </View>
  );
};

export const EmptyComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isExplorePage = pathname === '/explore';
  const text = isExplorePage
    ? 'No chat room found'
    : 'You are not in any chat room';
  const buttonText = isExplorePage
    ? 'Create a chat room'
    : 'Explore chat rooms';

  const path: Href = isExplorePage ? '/create-chat-room' : '/explore';
  const onPress = () => {
    router.push(path);
  };
  return (
    <View style={{ marginTop: isExplorePage ? 50 : 0 }}>
      <Title
        text={text}
        textStyle={{ color: colors.black, textAlign: 'center' }}
      />
      <Button
        text={buttonText}
        onPress={onPress}
        style={{ backgroundColor: 'transparent' }}
        textStyle={{ color: colors.lightblue }}
      />
    </View>
  );
};
