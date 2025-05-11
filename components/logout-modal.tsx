import { SubTitle } from '@/components/typography/subtitle';
import { Title } from '@/components/typography/title';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/h-stack';
import { colors } from '@/constants';
import { useAuth } from '@/lib/zustand/useAuth';
import { useStoreId } from '@/lib/zustand/useStoreId';
import Modal from 'react-native-modal';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { useId } from '@/lib/zustand/useId';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const LogoutModal = ({ onClose, visible }: Props) => {
  const removeUser = useAuth((state) => state.removeUser);
  const id = useId((state) => state.id);
  console.log({ id });
  const removeDetails = useStoreId((state) => state.removeDetails);

  const onClearDetails = useStoreId.persist.clearStorage;
  const onClearStorage = useAuth.persist.clearStorage;
  const onRemoveId = useId((state) => state.removeId);

  const onPress = async () => {
    if (!id) return;
    removeUser();
    onClearStorage();
    onClose();
    removeDetails();
    onClearDetails();

    onRemoveId();
  };

  return (
    <Modal
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      isVisible={visible}
      backdropOpacity={0.8}
      backdropColor="rgba(0, 0, 0, 0.5)"
      style={{}}
    >
      <Card>
        <Title
          text="Logout"
          textStyle={{
            fontFamily: 'NunitoBold',
            color: colors.black,
            textAlign: 'center',
          }}
        />
        <SubTitle
          text="Are you sure you want to log out?"
          textStyle={{
            fontFamily: 'NunitoRegular',
            color: colors.black,
            textAlign: 'center',
            fontSize: RFPercentage(1.8),
          }}
        />

        <HStack
          gap={10}
          leftContent={() => (
            <Button style={{ flex: 1 }} text={'Cancel'} onPress={onClose} />
          )}
          rightContent={() => (
            <Button
              style={{ flex: 1, backgroundColor: 'red' }}
              text={'Logout'}
              onPress={onPress}
            />
          )}
        />
      </Card>
    </Modal>
  );
};
