import { ConfirmPassCode } from '@/components/ui/confirm-passcode-form';
import { CustomBackgroundImage } from '@/components/ui/custom-background';
import { ScrollWrapper } from '@/components/ui/wrapper';
import { StatusBar } from 'expo-status-bar';

const Confirm = () => {
  return (
    <ScrollWrapper styles={{ paddingHorizontal: 0 }}>
      <CustomBackgroundImage
        text={'Confirm pin'}
        text2={'Keep this pin safe, you will use it to access your data'}
      >
        <StatusBar hidden />
        <ConfirmPassCode />
      </CustomBackgroundImage>
    </ScrollWrapper>
  );
};
export default Confirm;
