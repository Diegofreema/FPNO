import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

export const Card = ({ children }: PropsWithChildren) => {
  return <View style={styles.card}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    paddingVertical: 20,
    gap: 10,
  },
});
