import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";

const { width } = Dimensions.get("window");

export const ChatSkeletonUI = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Skeleton colorMode="light" width={48} height={48} radius="round" />
        <MotiView
          transition={{ type: "timing" }}
          style={styles.headerTextContainer}
        >
          <Skeleton colorMode="light" width={120} height={16} />
          <View style={styles.headerSubtitle}>
            <Skeleton colorMode="light" width={80} height={12} />
          </View>
        </MotiView>
      </View>

      {/* Messages Skeleton */}
      <View style={styles.messagesContainer}>
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <MotiView
            transition={{ type: "timing" }}
            key={index}
            style={[
              styles.messageSkeleton,
              index % 2 === 0 ? styles.leftMessage : styles.rightMessage,
            ]}
          >
            <Skeleton
              colorMode="light"
              width={index % 2 === 0 ? width * 0.7 : width * 0.6}
              height={70}
              radius={12}
            />
          </MotiView>
        ))}
      </View>

      {/* Input Skeleton */}
      <View style={styles.inputContainer}>
        <MotiView transition={{ type: "timing" }} style={styles.inputIcon}>
          <Skeleton colorMode="light" width={40} height={40} radius="round" />
        </MotiView>
        <MotiView>
          <Skeleton
            colorMode="light"
            width={width - 120}
            height={40}
            radius={20}
          />
        </MotiView>
        <MotiView transition={{ type: "timing" }} style={styles.inputSendIcon}>
          <Skeleton colorMode="light" width={40} height={40} radius="round" />
        </MotiView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  headerSubtitle: {
    marginTop: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageSkeleton: {
    marginBottom: 16,
  },
  leftMessage: {
    alignSelf: "flex-start",
  },
  rightMessage: {
    alignSelf: "flex-end",
  },
  inputContainer: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",

    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    marginTop: "auto",
  },
  inputIcon: {
    marginRight: 8,
  },
  inputSendIcon: {
    marginLeft: 8,
  },
});
