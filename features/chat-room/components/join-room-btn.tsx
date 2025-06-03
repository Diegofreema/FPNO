import {CustomPressable} from "@/components/ui/custom-pressable";
import {colors} from "@/constants";
import {useAuth} from "@/lib/zustand/useAuth";
import React, {useState} from "react";
import {StyleSheet, Text} from "react-native";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {generateErrorMessage} from "@/helper";
import {toast} from "sonner-native";
import {RFPercentage} from "react-native-responsive-fontsize";

type Props = {
  roomId: Id<"rooms">;
  isInPending: boolean;
};

export const JoinBtn = ({ roomId, isInPending }: Props) => {
  const userId = useAuth((state) => state.user?.convexId!);
  const [isPending, setIsPending] = useState(false);
  const joinRoom = useMutation(api.room.joinRoom);
  const onPress = async () => {
    setIsPending(true);
    try {
      await joinRoom({
        room_id: roomId,
        member_to_join: userId!,
      });
      toast.success("Request has been sent");
    } catch (e) {
      const errorMessage = generateErrorMessage(e, "Failed to send request");
      toast.error(errorMessage);
    } finally {
      setIsPending(false);
    }
  };
  const text = isInPending ? "Pending" : "Join";
  return (
    <CustomPressable
      style={styles.followBtn}
      disabled={isPending || isInPending}
      onPress={onPress}
    >
      <Text style={styles.followText}>{text}</Text>
    </CustomPressable>
  );
};

const styles = StyleSheet.create({
  followBtn: {
    borderRadius: 15,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.lightblue,
  },
  followText: {
    color: colors.white,
    fontSize: RFPercentage(1.4)
  },
});
