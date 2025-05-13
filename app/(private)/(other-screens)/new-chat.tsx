import { ActionIcon } from '@/components/ui/action-icon';
import { Spacer } from '@/components/ui/divider';
import { ErrorComponent } from '@/components/ui/error-component';
import { Loading } from '@/components/ui/loading';
import { NavHeader } from '@/components/ui/nav-header';
import { Wrapper } from '@/components/ui/wrapper';
import { useGetOtherUsers } from '@/features/chat/api/use-get-users';
import { SearchInput } from '@/features/chat/components/search-converstion';
import { Users } from '@/features/chat/components/users';
import { useAuth } from '@/lib/zustand/useAuth';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useDebounce } from 'use-debounce';

const NewChatScreen = () => {
  const [value, setValue] = useState('');

  const [query] = useDebounce(value, 500);
  const [offset, setOffset] = useState(0);
  const userData = useAuth((state) => state.user);
  const router = useRouter();
  const { data, isPending, isError, refetch, isFetching } = useGetOtherUsers({
    userId: userData?.id!,
    query,
    offSet: offset,
  });
  const onEndReached = useCallback(() => {
    if (isFetching || isPending) return;
    if (data?.total && data.total > offset + 10) {
      setOffset((prevOffset) => prevOffset + 10);
    }
  }, [data, offset, isFetching, isPending]);
  if (isError) {
    return <ErrorComponent onPress={refetch} />;
  }
  if (isPending) {
    return <Loading />;
  }
  const onAction = () => {
    router.push('/new-group');
  };

  return (
    <Wrapper>
      <NavHeader title="New chat" />

      <SearchInput
        value={value}
        onChangeText={setValue}
        placeholder="Search people"
      />
      <Spacer space={10} />
      <ActionIcon name="user-secret" onPress={onAction} text={'New group'} />
      <Spacer space={10} />
      <Users
        users={data.documents}
        total={data.total}
        onEndReached={onEndReached}
      />
    </Wrapper>
  );
};

export default NewChatScreen;
