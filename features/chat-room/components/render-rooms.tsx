import {Title} from '@/components/typography/title';
import {Button} from '@/components/ui/button';
import {colors} from '@/constants';
import {LegendList} from '@legendapp/list';
import {Href, usePathname, useRouter} from 'expo-router';
import {View} from 'react-native';
import {RenderRoom} from './render-room';
import {Doc} from "@/convex/_generated/dataModel";

type Props = {
  rooms: Doc<'rooms'>[];
  handleLoadMore: () => void;
};

export const RenderRooms = ({ rooms, handleLoadMore }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={rooms}
        renderItem={({ item }) => <RenderRoom room={item} />}
        keyExtractor={(item) => item._id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
        ListEmptyComponent={EmptyComponent}
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
