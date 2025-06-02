import {Avatar} from "@/components/ui/avatar";
import {HStack} from "@/components/ui/h-stack";
import {colors} from "@/constants";
import React, {ReactNode} from "react";
import {Text, View} from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";
import {Doc} from "@/convex/_generated/dataModel";

type Props = {
  user: Doc<"users">;
  rightContent?: ReactNode;
};

export const User = ({ user, rightContent }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <HStack
        justifyContent="flex-start"
        alignItems="center"
        gap={10}
        leftContent={() => <Avatar imgSrc={user.imageUrl} size={50} />}
        rightContent={() => (
          <Right name={user.name} matric={user.matriculation_number} />
        )}
      />

      {rightContent}
    </View>
  );
};

const Right = ({ name, matric }: { name: string; matric?: string }) => {
  return (
    <View style={{ gap: 5 }}>
      <Text
        style={{
          fontSize: RFPercentage(1.6),
          fontWeight: "bold",
          color: colors.black,
        }}
      >
        {name}
      </Text>
      {matric && (
        <Text style={{ fontSize: RFPercentage(1.4), color: colors.textGray }}>
          {matric}
        </Text>
      )}
    </View>
  );
};
