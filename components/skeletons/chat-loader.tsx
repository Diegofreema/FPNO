import { FlatList, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { colors } from "@/constants";

export const ChatLoader = ({ length = 10 }: { length?: number }) => {
  return (
    <FlatList
      data={[...Array(length)].map((_, i) => i)}
      renderItem={() => (
        <MotiView
          transition={{
            type: "timing",
          }}
          style={styles.chatStyles}
          animate={{ backgroundColor: "#ffffff" }}
        >
          <Skeleton colorMode="light" radius={"round"} width={60} height={60} />
          <MotiView style={{ gap: 10 }}>
            <Skeleton colorMode="light" width={80} height={15} />
            <Skeleton colorMode="light" width={150} height={15} />
          </MotiView>
        </MotiView>
      )}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={{ gap: 15 }}
    />
  );
};

const styles = StyleSheet.create({
  chatStyles: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
});
