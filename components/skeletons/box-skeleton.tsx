import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { FlatList } from "react-native";

const arrayLength = 4;

export const BoxSkeleton = () => {
  return (
    <FlatList
      data={[...Array(arrayLength)].map((_, i) => i)}
      renderItem={() => (
        <MotiView
          transition={{
            type: "timing",
          }}
          style={{ flex: 1 }}
          animate={{ backgroundColor: "#ffffff" }}
        >
          <Skeleton colorMode="light" width={"100%"} height={118} />
        </MotiView>
      )}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      numColumns={2}
      columnWrapperStyle={{ gap: 10 }}
      contentContainerStyle={{ gap: 10 }}
    />
  );
};
