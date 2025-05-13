import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '@/constants';
import { FontAwesome } from '@expo/vector-icons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Title } from '../typography/title';

type Props = {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  onPress: () => void;
  text?: string;
  style?: StyleProp<ViewStyle>;
};

export const ActionIcon = ({ onPress, text, style, name }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name={name} color={colors.white} size={25} />
      </View>
      {text && (
        <Title
          text={text}
          textStyle={{ color: colors.black, fontSize: RFPercentage(2.5) }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    height: 50,
    width: 50,
    backgroundColor: colors.lightblue,
  },
});
