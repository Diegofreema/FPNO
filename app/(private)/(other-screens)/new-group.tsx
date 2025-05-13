import { AbsoluteAction } from '@/components/ui/absolute-action';
import { Spacer } from '@/components/ui/divider';
import { Wrapper } from '@/components/ui/wrapper';
import { NewGroup } from '@/features/chat/components/new-group';
import { NewGroupUsers } from '@/features/chat/components/new-group-users';
import { SearchHeader } from '@/features/chat/components/search-header';
import { useNewGroupMembers } from '@/lib/zustand/useNewGroupMembers';
import { useRouter } from 'expo-router';
import React from 'react';

const NewGroupScreen = () => {
  const hasMember = useNewGroupMembers((state) => state.members);
  const clearMembers = useNewGroupMembers((state) => state.clearMembers);
  const router = useRouter();
  const onAction = () => router.push('/create-group');
  return (
    <Wrapper>
      <SearchHeader title={'New Group'} onPress={clearMembers} />
      <Spacer space={10} />
      <NewGroupUsers />
      <Spacer space={10} />
      <NewGroup />
      {hasMember.length > 0 && (
        <AbsoluteAction name="arrow-right" onPress={onAction} />
      )}
    </Wrapper>
  );
};

export default NewGroupScreen;
