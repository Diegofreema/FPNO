import {ActionIcon} from '@/components/ui/action-icon';
import {Spacer} from '@/components/ui/divider';
import {NavHeader} from '@/components/ui/nav-header';
import {Wrapper} from '@/components/ui/wrapper';
import {SearchInput} from '@/features/chat/components/search-converstion';
import {Users} from '@/features/chat/components/users';
import {useRouter} from 'expo-router';
import React, {useCallback, useState} from 'react';

const NewChatScreen = () => {
  const [value, setValue] = useState('');


  const router = useRouter();

  const onEndReached = useCallback(() => {

  }, []);

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
        users={[]}
        total={0}
        onEndReached={onEndReached}
      />
    </Wrapper>
  );
};

export default NewChatScreen;
