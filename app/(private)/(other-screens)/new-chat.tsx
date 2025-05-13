import { ErrorComponent } from '@/components/ui/error-component';
import { Loading } from '@/components/ui/loading';
import { NavHeader } from '@/components/ui/nav-header';
import { Wrapper } from '@/components/ui/wrapper';
import { useGetOtherUsers } from '@/features/chat/api/use-get-users';
import { SearchInput } from '@/features/chat/components/search-converstion';
import { Users } from '@/features/chat/components/users';
import { useAuth } from '@/lib/zustand/useAuth';
import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
const NewChatScreen = () => {
  const [value, setValue] = useState('');
  const [query] = useDebounce(value, 500);
  const userData = useAuth((state) => state.user);

  const { data, isPending, isError, refetch } = useGetOtherUsers({
    userId: userData?.id!,
    query,
  });
  if (isError) {
    return <ErrorComponent onPress={refetch} />;
  }
  if (isPending) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <NavHeader title="New chat" />
      <SearchInput
        value={value}
        onChangeText={setValue}
        placeholder="Search people"
      />
      <Users users={data.documents} total={data.total} />
    </Wrapper>
  );
};

export default NewChatScreen;
