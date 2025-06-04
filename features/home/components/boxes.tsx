import { BoxSkeleton } from "@/components/skeletons/box-skeleton";
import { ErrorComponent } from "@/components/ui/error-component";
import { colors } from "@/constants";
import * as Linking from "expo-linking";
import { textToRender } from "@/helper";

import { useAuth } from "@/lib/zustand/useAuth";

import { AnimatedCard } from "@/components/animated/animated-card";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useGetDashboard } from "../api/use-get-dashboard";

const images = [
  require("@/assets/images/study4.png"),

  require("@/assets/images/study3.png"),

  require("@/assets/images/study2.png"),

  require("@/assets/images/study.png"),
];
export const Boxes = () => {
  const user = useAuth((state) => state.user);

  const { data, isError, isPending, refetch } = useGetDashboard(user?.id!);

  if (isError) {
    return <ErrorComponent onPress={refetch} />;
  }
  if (isPending || user === undefined) {
    return <BoxSkeleton />;
  }

  const objectToArray = Object.entries(data).map(([key, value]) => {
    return {
      key,
      value,
    };
  });

  return (
    <FlatList
      numColumns={2}
      columnWrapperStyle={{ gap: 10 }}
      scrollEnabled={false}
      contentContainerStyle={{
        gap: 10,
        paddingHorizontal: 5,
        paddingBottom: 10,
      }}
      data={objectToArray}
      renderItem={({ item, index }) => (
        <AnimatedCard index={index} style={{ flex: 1 }}>
          <Box item={item} index={index} />
        </AnimatedCard>
      )}
    />
  );
};

const Box = ({
  item,
  index,
}: {
  item: { key: string; value: string };
  index: number;
}) => {
  const onPress = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await Linking.openURL("https://fpn.netpro.software/login");
  };

  const img = images[index];
  return (
    <TouchableOpacity onPress={onPress} style={styles.box} activeOpacity={0.5}>
      <Image
        style={{ width: 40, height: 40, marginBottom: 10 }}
        source={img}
        contentFit="contain"
      />
      <View style={[styles.flex, { alignItems: "center" }]}>
        <Text style={styles.title}>{textToRender(item.key)}</Text>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 5,
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 10,
  },
  flex: {
    flexDirection: "row",
    gap: 10,
    marginTop: "auto",
  },
  title: {
    fontSize: RFPercentage(2),
    fontFamily: "NunitoRegular",
    flex: 1,
    color: colors.black,
  },
  value: {
    fontSize: RFPercentage(2.5),
    textAlign: "center",
    fontFamily: "NunitoBold",
    color: colors.black,
  },
});
