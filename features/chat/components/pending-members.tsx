import { LoadingModal } from '@/components/typography/loading-modal';
import { useAccept } from '@/features/chat-room/api/use-accept';
import { useDecline } from '@/features/chat-room/api/use-decline';
import { MemberWithUserProfile } from '@/types';
import { LegendList } from '@legendapp/list';
import React from 'react';
import { View } from 'react-native';
import { ChatMenu } from './chat-menu';
import { User } from './user';

type Props = {
  users: MemberWithUserProfile[];
  handleMore: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  roomId: string;
};

export const PendingMembers = ({
  users,
  handleMore,
  onRefresh,
  refreshing,
  roomId,
}: Props) => {
  const { mutateAsync: accept, isPending: isAccepting } = useAccept();
  const { mutateAsync: decline, isPending: isDeclining } = useDecline();
  const isVisible = isAccepting || isDeclining;

  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={users}
        keyExtractor={(item) => item.$id}
        recycleItems
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={handleMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <User
            user={item.user}
            rightContent={
              <ChatMenu
                disable={isAccepting || isDeclining}
                menuItems={[
                  {
                    text: 'Accept',
                    onSelect: () =>
                      accept({ roomId, memberId: item.member_id }),
                  },
                  {
                    text: 'Decline',
                    onSelect: () =>
                      decline({ roomId, memberId: item.member_id }),
                  },
                ]}
              />
            }
          />
        )}
        contentContainerStyle={{ gap: 15 }}
      />
      <LoadingModal visible={isVisible} />
    </View>
  );
};
