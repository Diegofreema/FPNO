import { CustomBackgroundImage } from '@/components/ui/custom-background';
import { LockComponent } from '@/components/ui/lock-component';

const Lock = () => {
  return (
    <CustomBackgroundImage
      text={'Login to your Account'}
      text2={'Welcome Back'}
    >
      <LockComponent />
    </CustomBackgroundImage>
  );
};
export default Lock;
