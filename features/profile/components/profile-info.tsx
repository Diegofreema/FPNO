import { AnimatedContainer } from '@/components/animated/animated-container';

import { IDCard } from './id';
import { ProfileDetail } from './profile-details';

export const ProfileInfo = () => {
  return (
    <AnimatedContainer>
      <ProfileDetail />
      <IDCard />
    </AnimatedContainer>
  );
};
