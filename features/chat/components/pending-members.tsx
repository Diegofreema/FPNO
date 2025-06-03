import {LoadingModal} from "@/components/typography/loading-modal";
import {RoomMemberType} from "@/types";
import {LegendList} from "@legendapp/list";
import React, {useState} from "react";
import {View} from "react-native";
import {ChatMenu} from "./chat-menu";
import {User} from "./user";
import {Id} from "@/convex/_generated/dataModel";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {toast} from "sonner-native";
import {generateErrorMessage} from "@/helper";

type Props = {
  users: RoomMemberType[];
  handleMore: () => void;

  roomId: Id<"rooms">;
};

export const PendingMembers = ({
  users,
  handleMore,

  roomId,
}: Props) => {
  const [sending, setSending] = useState(false);



  const acceptRequest = useMutation(api.room.acceptRequest);
  const declineRequest = useMutation(api.room.declineRequest);

  const onAccept = async (roomId: Id<"rooms">, memberId: Id<"users">) => {
    setSending(true);
    try {
      await acceptRequest({
        room_id: roomId,
        member_to_join: memberId,
      });
      toast.success("Request accepted");
    } catch (e) {
      const errorMessage = generateErrorMessage(e, "Failed to accept request");
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };
  const onDecline = async (roomId: Id<"rooms">, memberId: Id<"users">) => {
    setSending(true);
    try {
      await declineRequest({
        room_id: roomId,
        member_to_join: memberId,
      });
      toast.success("Request declined");
    } catch (e) {
      const errorMessage = generateErrorMessage(e, "Failed to decline request");
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={users}
        keyExtractor={(item) => item._id}
        recycleItems
        onEndReached={handleMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <User
            user={item.user!}
            rightContent={
              <ChatMenu
                disable={sending}
                menuItems={[
                  {
                    text: "Accept",
                    onSelect: () => onAccept(roomId, item.member_id),
                  },
                  {
                    text: "Decline",
                    onSelect: () =>
                        onDecline( roomId, item.member_id ),
                  },
                ]}
              />
            }
          />
        )}
        contentContainerStyle={{ gap: 15 }}
      />
      <LoadingModal visible={sending} />
    </View>
  );
};
