import { ErrorComponent } from '@/components/ui/error-component';
import { Loading } from '@/components/ui/loading';
import { NavHeader } from '@/components/ui/nav-header';
import { SearchInput } from '@/features/chat/components/search-converstion';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useDebounce } from 'use-debounce';
import { useExploreRooms } from '../api/use-explore-rooms';
import { RenderRooms } from './render-rooms';

export const Explore = () => {
  const [value, setValue] = useState('');
  const [search] = useDebounce(value, 500);
  const [more, setMore] = useState(0);
  const { data, isPending, isError, refetch } = useExploreRooms({
    more,
    search,
  });
  if (isError) {
    return <ErrorComponent onPress={refetch} />;
  }

  if (isPending) {
    return <Loading />;
  }

  const { documents, total } = data;
  const handleMore = () => {
    if (documents.length >= total) return;
    setMore(more + 10);
  };

  return (
    <View style={{ flex: 1 }}>
      <NavHeader title="Explore chat rooms" />
      <SearchInput
        placeholder="Search rooms"
        value={value}
        onChangeText={setValue}
      />

      <RenderRooms channels={documents} handleLoadMore={handleMore} />
    </View>
  );
};
