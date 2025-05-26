import { AnimatedContainerToken } from '../animated/animated-container';
import { PassCodeForm } from './passcode-form';

export const PassCode = () => {
  return (
    <AnimatedContainerToken>
      <PassCodeForm />
    </AnimatedContainerToken>
  );
};
