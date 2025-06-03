import {Loading} from "@/components/ui/loading";
import {NavHeader} from "@/components/ui/nav-header";
import {Wrapper} from "@/components/ui/wrapper";
import {EditRoom} from "@/features/chat/components/edit-room";
import {Redirect, useLocalSearchParams} from "expo-router";
import React from "react";
import {Id} from "@/convex/_generated/dataModel";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {toast} from "sonner-native";

const EditScreen = () => {
  const { roomId } = useLocalSearchParams<{ roomId: Id<"rooms"> }>();
  const room = useQuery(api.room.room, { room_id: roomId });

  if (room === undefined) {
    return <Loading />;
  }

  if (room === null) {
    toast("Room does not exist");
    return <Redirect href={"/chat"} />;
  }
  return (
    <Wrapper>
      <NavHeader title="Edit room" />
      <EditRoom
        initialData={{
          description: room?.description,
          image_url: room?.image_url,
          channel_name: room?.room_name,
          _id: room?._id,
          image_id: room.image_id,
        }}
      />
    </Wrapper>
  );
};

export default EditScreen;
