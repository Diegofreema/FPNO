import {Loading} from "@/components/ui/loading";
import {NavHeader} from "@/components/ui/nav-header";
import {SearchInput} from "@/features/chat/components/search-converstion";
import React, {useState} from "react";
import {View} from "react-native";
import {useDebounce} from "use-debounce";
import {RenderRooms} from "./render-rooms";
import {usePaginatedQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useAuth} from "@/lib/zustand/useAuth";

export const Explore = () => {
  const [value, setValue] = useState("");
  const [search] = useDebounce(value, 500);

  const convexId = useAuth((state) => state.user?.convexId!);
  const rooms = usePaginatedQuery(
    api.room.exploreRooms,
    { user_id: convexId },
    { initialNumItems: 30 },
  );
  const searchRooms = usePaginatedQuery(
    api.room.exploreRoomsSearch,
    { user_id: convexId, name: search },
    { initialNumItems: 30 },
  );

  const { isLoading, loadMore, status, results } = rooms;
  const {
    isLoading: isLoadingSearch,
    loadMore: loadMoreSearch,
    status: searchStatus,
    results: searchResults,
  } = searchRooms;
  const pending = isLoading || isLoadingSearch;
  if (pending) {
    return <Loading />;
  }

  const handleMore = () => {
    if (!isLoading && status === "CanLoadMore") {
      loadMore(25);
    }
  };
  const handleMoreSearch = () => {
    if (!isLoadingSearch && searchStatus === "CanLoadMore") {
      loadMoreSearch(25);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <NavHeader title="Explore chat rooms" />
      <SearchInput
        placeholder="Search rooms"
        value={value}
        onChangeText={setValue}
      />

      {search ? (
        <RenderRooms rooms={searchResults} handleLoadMore={handleMoreSearch} />
      ) : (
        <RenderRooms rooms={results} handleLoadMore={handleMore} />
      )}
    </View>
  );
};
