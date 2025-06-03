import {LoadingModal} from "@/components/typography/loading-modal";
import {SubTitle} from "@/components/typography/subtitle";
import {CustomPressable} from "@/components/ui/custom-pressable";
import {HStack} from "@/components/ui/h-stack";
import {colors} from "@/constants";
import {ChatRoleDisplay} from "@/features/chat-room/components/role";
import {useAuth} from "@/lib/zustand/useAuth";
import {MemberAccessRole, RoomMemberType} from "@/types";
import {Feather} from "@expo/vector-icons";
import {LegendList} from "@legendapp/list";
import React, {useState} from "react";
import {Alert, StyleSheet, View} from "react-native";
import {RFPercentage} from "react-native-responsive-fontsize";
import {ChatMenu} from "./chat-menu";
import {User} from "./user";
import {generateErrorMessage, sortMembersByRole} from "@/helper";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {toast} from "sonner-native";

type Props = {
  infoData: RoomMemberType[];
  handleMore: () => void;
  creatorId: string;
  roomId: Id<"rooms">;
  disableAction: boolean;
  loggedInUser: string;
  show: boolean;
};

export const RoomInfo = ({
  infoData,
  handleMore,
  creatorId,
  roomId,
  disableAction,
  loggedInUser,
  show,
}: Props) => {

  const [sending, setSending] = useState(false);
  const leaveRoom = useMutation(api.member.leaveRoom);
  const removeUser = useMutation(api.member.removeUser);
  const updateUserRole = useMutation(api.member.updateUserRole);
  const actionUserId = useAuth((state) => state.user?.convexId!);
  const onRemoveUser = async ({ memberId }: { memberId: Id<"users"> }) => {
    Alert.alert("Are you sure?", "This can not be reversed", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Remove",
        onPress: async () => {
          setSending(true);
          try {
            await removeUser({
              room_id: roomId,
              member_id: memberId,
              actionUser_id: actionUserId,
            });
            toast.success("User removed");
          } catch (e) {
            const errorMessage = generateErrorMessage(
              e,
              "Failed to remove user",
            );
            toast.error(errorMessage);
          } finally {
            setSending(false);
          }
        },
        style: "destructive",
      },
    ]);
  };
  const onChangeRole = async (memberId: Id<'users'>) => {
    Alert.alert("Update role", "This will update the user role", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Update",
        onPress: async () => {
          setSending(true);
          try {
            await updateUserRole({
              room_id: roomId,
              member_id: memberId,
              actionUser_id: actionUserId,
            });
            toast.success("User role updated");
          } catch (e) {
            const errorMessage = generateErrorMessage(
                e,
                "Failed to update user role",
            );
            toast.error(errorMessage);
          } finally {
            setSending(false);
          }
        },
        style: "default",
      },
    ]);
  };

  const sortedMemberArray = sortMembersByRole(infoData);
  const onLeaveRoom = async () => {
    Alert.alert("Are you sure?", "This can not be reversed!!!", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Leave",
        onPress: async () => {
          setSending(true);
          try {
            await leaveRoom({ room_id: roomId, member_id: actionUserId });
            toast.success("You have left the room");
          } catch (e) {
            const errorMessage = generateErrorMessage(
              e,
              "Failed to leave room",
            );
            toast.error(errorMessage);
          } finally {
            setSending(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingModal visible={sending} />
      <LegendList
        data={sortedMemberArray}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isAdmin = item.access_role === MemberAccessRole.ADMIN;
          const roleText =
            creatorId === item.user?._id
              ? "owner"
              : isAdmin
                ? "admin"
                : "member";
          const disabled = creatorId === item.user?._id;
          const text = isAdmin ? "Member" : "Admin";
          return (
            <ChatMenu
              disable={
                disabled || disableAction || item.user?._id === loggedInUser
              }
              trigger={
                <User
                  user={item.user!}
                  rightContent={<ChatRoleDisplay role={roleText} />}
                />
              }
              menuItems={[
                {
                  text: "Remove",
                  onSelect: () => onRemoveUser({ memberId: item.member_id }),
                },
                {
                  text: `Make ${text}`,
                  onSelect: () => onChangeRole(item.member_id),
                },
              ]}
            />
            // <User
            //   user={item.user}
            //   rightContent={<ChatRoleDisplay role={roleText} />}
            // />
          );
        }}
        keyExtractor={(item) => item._id}
        ListFooterComponent={() => (
          <ListFooterComponent
            show={show}
            handleMore={handleMore}
            onLeaveRoom={onLeaveRoom}
            isNotCreator={creatorId !== loggedInUser}
          />
        )}
        scrollEnabled={false}
        contentContainerStyle={{ gap: 15 }}
        recycleItems
      />
    </View>
  );
};

const ListFooterComponent = ({
  handleMore,
  show,
  onLeaveRoom,
  isNotCreator,
}: {
  show: boolean;
  handleMore: () => void;
  onLeaveRoom: () => void;
  isNotCreator: boolean;
}) => {
  return (
    <View style={styles.listFooter}>
      {show && (
        <CustomPressable onPress={handleMore}>
          <SubTitle text="Load more" textStyle={{ color: colors.lightblue }} />
        </CustomPressable>
      )}
      {isNotCreator && (
        <CustomPressable onPress={onLeaveRoom}>
          <HStack
            alignItems="center"
            style={{ gap: 10 }}
            leftContent={() => (
              <Feather name="log-out" size={30} color={colors.red} />
            )}
            rightContent={() => (
              <SubTitle
                text="Leave"
                textStyle={{ color: colors.red, fontSize: RFPercentage(2) }}
              />
            )}
          />
        </CustomPressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listFooter: {
    marginTop: 20,
    gap: 10,
  },
});
