import {CustomBackgroundImage} from '@/components/ui/custom-background';
import {LockComponent} from '@/components/ui/lock-component';
import {useLocalSearchParams} from "expo-router";

const Lock = () => {
  const { off } = useLocalSearchParams<{ off?: string }>();

  const title = off ? 'Are you sure?' : 'Login to your account';
  const subtitle = off ? 'Turn off finger print' : 'Welcome Back';
  return (
    <CustomBackgroundImage
      text={title}
      text2={subtitle}
    >
      <LockComponent />
    </CustomBackgroundImage>
  );
};
export default Lock;
