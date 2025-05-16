import { ChannelType, MemberWithUserProfile } from '@/types';
import { LegendList } from '@legendapp/list';
import React from 'react';
import { View } from 'react-native';
import { Models } from 'react-native-appwrite';
import { RoomInfoTop } from './room-info-top';
import { User } from './user';

type Props = {
  infoData: {
    data: ChannelType;
    memberData: Models.DocumentList<MemberWithUserProfile>;
  }[];
  handleMore: () => void;
  onRefresh: () => void;
  refreshing: boolean;
};

export const RoomInfo = ({
  infoData,
  handleMore,
  onRefresh,
  refreshing,
}: Props) => {
  const dataToDisplay = infoData[0];

  const {
    data,
    memberData: { documents, total },
  } = dataToDisplay;
  const hide = documents.length === total;
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        ListHeaderComponent={() => <RoomInfoTop data={data} />}
        data={documents}
        onRefresh={onRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <User user={item.user} />}
        keyExtractor={(item) => item.$id}
        ListFooterComponent={() => (
          <ListFooterComponent hide={hide} handleMore={handleMore} />
        )}
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
