import { MotiView } from 'moti';
import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants';

export const AnimatedContainer = ({ children }: PropsWithChildren) => {
  return (
    <MotiView
      from={{ translateY: 500 }}
      animate={{ translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={styles.container}
    >
      {children}
    </MotiView>
  );
};
export const AnimatedContainerToken = ({ children }: PropsWithChildren) => {
  return <View style={styles.container}>{children}</View>;
};
export const AnimatedForgotToken = ({ children }: PropsWithChildren) => {
  return (
    <MotiView
      from={{ translateY: 500 }}
      animate={{ translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={styles.container}
    >
      {children}
    </MotiView>
  );
};
export const AnimatedContainerPasscode = ({ children }: PropsWithChildren) => {
  return <View style={styles.container}>{children}</View>;
};
export const AnimatedContainerCheckPasscode = ({
  children,
}: PropsWithChildren) => {
  return (
    <MotiView
      from={{ translateY: 500 }}
      animate={{ translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={styles.container}
    >
      {children}
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: '100%',
    height: '100%',
    padding: 20,
    paddingTop: 30,
  },
});
