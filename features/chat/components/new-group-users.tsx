import { colors } from '@/constants';
import { useNewGroupMembers } from '@/lib/zustand/useNewGroupMembers';
import { NewConversationType } from '@/types';
import { IconX } from '@tabler/icons-react-native';
import { Image } from 'expo-image';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

// const _layoutTransition = LinearTransition.springify()
//   .damping(80)
//   .stiffness(200);

export const NewGroupUsers = () => {
  const newMembers = useNewGroupMembers((state) => state.members);
  // const height = useSharedValue(0);
  // const animatedStyle = useAnimatedStyle(() => ({
  //   height: withSpring(height.value, {
  //     damping: 80,
  //     stiffness: 200,
  //   }),
  // }));
  // useEffect(() => {
  //   if (newMembers.length) {
  //     height.value = 80;
  //   } else {
  //     height.value = 0;
  //   }
  // }, [newMembers, height]);
  return (
    <View>
      <ScrollView
        style={{
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        }}
        contentContainerStyle={{
          gap: 15,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {newMembers.map((member, index) => (
          <NewGroupUser item={member} key={index} showBtn={true} />
        ))}
      </ScrollView>
    </View>
  );
};

export const NewGroupUser = ({
  item,
  showBtn = false,
}: {
  item: NewConversationType;
  showBtn: boolean;
}) => {
  const removeMember = useNewGroupMembers((state) => state.removeMember);
  return (
    <View
      // layout={_layoutTransition}
      style={{ alignItems: 'center', flex: 1 }}
      // entering={ZoomIn}
      // exiting={ZoomOut}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        contentFit="cover"
      />
      {showBtn && <Text style={styles.text}>{item.name}</Text>}
      {showBtn && (
        <TouchableOpacity
          style={styles.abs}
          activeOpacity={0.7}
          onPress={() => removeMember(item.id)}
        >
          <IconX color={colors.white} size={15} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  abs: {
    position: 'absolute',
    backgroundColor: colors.lightblue,
    borderRadius: 50,
    right: -5,
    padding: 5,
  },
  text: { fontSize: RFPercentage(1.3), fontFamily: 'NunitoRegular' },
  image: { width: 60, height: 60, borderRadius: 50 },
});
