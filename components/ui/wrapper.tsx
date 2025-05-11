import { ScrollView } from 'moti';
import { PropsWithChildren } from 'react';
import { RefreshControl, StyleProp, View, ViewStyle } from 'react-native';

type Props = {
  styles?: StyleProp<ViewStyle>;
};

export const Wrapper = ({ children, styles }: PropsWithChildren<Props>) => {
  return (
    <View
      style={[
        { flex: 1, paddingHorizontal: 10, backgroundColor: '#fff' },
        styles,
      ]}
    >
      {children}
    </View>
  );
};

type ScrollProps = {
  refreshing?: boolean;
  onRefresh?: () => void;
  styles?: StyleProp<ViewStyle>;
};
export const ScrollWrapper = ({
  children,
  refreshing = false,
  onRefresh,
  styles,
}: PropsWithChildren<ScrollProps>) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  return (
    <ScrollView
      style={[{ paddingHorizontal: 20, backgroundColor: '#fff' }, styles]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 15, paddingBottom: 50 }}
    >
      {children}
    </ScrollView>
  );
};
