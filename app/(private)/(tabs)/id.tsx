import { ScrollWrapper } from '@/components/ui/wrapper';
import { IDModal } from '@/features/id/components/id-modal';
import React from 'react';
import { View } from 'react-native';

const id = () => {
  return (
    <ScrollWrapper>
      <View style={{ paddingTop: 50 }}>
        <IDModal />
      </View>
    </ScrollWrapper>
  );
};

export default id;
