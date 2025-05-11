import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/h-stack';
import { colors } from '@/constants';
import { useAuth } from '@/lib/zustand/useAuth';
import Modal from 'react-native-modal';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { useId } from '@/lib/zustand/useId';
import { Text } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const LogoutModal = ({ onClose, visible }: Props) => {
  const removeUser = useAuth((state) => state.removeUser);

  const onRemoveId = useId((state) => state.removeId);

  const onPress = async () => {
    removeUser();

    onClose();

    onRemoveId();
  };

  return (
    <Modal
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      isVisible={visible}
      backdropOpacity={0.8}
      backdropColor="rgba(0, 0, 0, 0.5)"
    >
      <Card>
        <Text
          style={{
            fontFamily: 'NunitoBold',
            color: colors.black,
            textAlign: 'center',
          }}
        >
          Logout
        </Text>
        <Text
          style={{
            fontFamily: 'NunitoRegular',
            color: colors.black,
            textAlign: 'center',
            fontSize: RFPercentage(1.8),
          }}
        >
          Are you sure you want to log out?
        </Text>

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
