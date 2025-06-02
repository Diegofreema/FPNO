import {Loading} from "@/components/ui/loading";
import {useSelected} from "@/features/chat-room/hook/use-selected";
import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {useDebounce} from "use-debounce";
import {ChatHeader} from "./chat-header";
import {SearchInput} from "./search-converstion";
import {TopChannels} from "./top-channels";
import {usePaginatedQuery, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useAuth} from "@/lib/zustand/useAuth";
import {RenderRooms} from "@/features/chat-room/components/render-rooms";

export const Chat = () => {
  const [value, setValue] = useState("");
  const conexId = useAuth((state) => state?.user?.convexId!);
  const [search] = useDebounce(value, 500);

  const topRooms = useQuery(api.room.getTopRooms);
  const selectedMessages = useSelected((state) => state.selected);
  const clearMessages = useSelected((state) => state.clear);
  const channelsThatIamIn = usePaginatedQuery(
    api.room.getRoomsThatIamIn,
    { user_id: conexId },
    { initialNumItems: 20 },
  );


  useEffect(() => {
    if (selectedMessages.length > 0) {
      clearMessages();
    }
  }, [selectedMessages, clearMessages]);
const {results,status,loadMore,isLoading} = channelsThatIamIn
  const isPending = topRooms === undefined || isLoading
  if (isPending) {
    return <Loading />;
  }


  const handleLoadMore = () => {
    if(status === 'CanLoadMore' && !isLoading) {
      loadMore(20)
    }
  }

  return (
    <View style={{ gap: 10, flex: 1 }}>
      <ChatHeader />
      <SearchInput
        placeholder="Search conversations"
        value={value}
        onChangeText={setValue}
      />
      <TopChannels channels={topRooms} />
      <RenderRooms rooms={results} handleLoadMore={handleLoadMore} />
    </View>
  );
};
