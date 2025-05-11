import { FlatList } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { colors } from "@/constants";

export const ArticleSkeleton = ({
  arrayLength = 5,
  showHeader,
}: {
  arrayLength?: number;
  showHeader?: boolean;
}) => {
  return (
    <FlatList
      ListHeaderComponent={() =>
        showHeader ? (
          <MotiView
            transition={{
              type: "timing",
            }}
            style={{ flex: 1 }}
            animate={{ backgroundColor: "#ffffff" }}
          >
            <Skeleton colorMode="light" width={200} height={30} />
          </MotiView>
        ) : null
      }
      data={[...Array(arrayLength)].map((_, i) => i)}
      renderItem={() => (
        <MotiView
          transition={{
            type: "timing",
          }}
          style={{ flex: 1 }}
          animate={{ backgroundColor: "#ffffff" }}
        >
          <Skeleton colorMode="light" width={"100%"} height={60} />
        </MotiView>
      )}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={{
        gap: 10,
        borderWidth:  showHeader ? 1 : 0,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 15,
      }}
    />
  );
};
