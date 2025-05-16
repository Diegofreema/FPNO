import { MemberWithUserProfile } from '@/types';
import { LegendList } from '@legendapp/list';
import React from 'react';
import { View } from 'react-native';
import { Models } from 'react-native-appwrite';
import { User } from './user';

type Props = {
  infoData: Models.DocumentList<MemberWithUserProfile>;
  handleMore: () => void;
};

export const RoomInfo = ({ infoData, handleMore }: Props) => {
  const { documents, total } = infoData;
  const hide = documents.length === total;
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={documents}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <User user={item.user} />}
        keyExtractor={(item) => item.$id}
        ListFooterComponent={() => (
          <ListFooterComponent hide={hide} handleMore={handleMore} />
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

const ListFooterComponent = ({
  handleMore,
  hide,
}: {
  hide: boolean;
  handleMore: () => void;
}) => {
  return <View></View>;
};
