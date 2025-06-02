import {zodResolver} from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {useForm} from "react-hook-form";

import {useAuth} from "@/lib/zustand/useAuth";
import {View} from "react-native";
import {CreateChatRoomSchema, createChatRoomSchema} from "../schema";
import {RoomForm} from "./room-form";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {uploadProfilePicture} from "@/helper";
import {useRouter} from "expo-router";

import {ConvexError} from "convex/values";
import {toast} from "sonner-native";

export const CreateChatRoom = () => {
  const generateUploadUrl = useMutation(api.user.generateUploadUrl);
  const createRoom = useMutation(api.room.createRoom);
  const user = useAuth((state) => state.user);
  const router = useRouter();
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<CreateChatRoomSchema>({
    defaultValues: {
      name: "",
      description: "",
      image: "",
    },
    resolver: zodResolver(createChatRoomSchema),
  });
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.5,
    });
    console.log("image url", result?.assets?.[0].uri);
    if (!result.canceled) {
      setValue("image", result.assets?.[0]?.uri);
    }
  };
  const onSubmit = async (data: CreateChatRoomSchema) => {
    try {
      const res = await uploadProfilePicture(generateUploadUrl, data.image);

      const roomId = await createRoom({
        room_name: data.name,
        description: data.description,
        creator_id: user?.convexId!,
        image_url: res?.uploadUrl,
        image_id: res?.storageId,
      });
      router.replace(`/chat/${roomId}`);
      reset();
      // router.back()
      toast.success("Chat room created successfully");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error instanceof ConvexError
          ? (error.data as string)
          : "Failed to create chat room";
      toast.error(errorMessage);
    }
  };
  const { image } = watch();

  return (
    <View style={{ flex: 1 }}>
      <RoomForm
        imageUrl={image}
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        pickImage={pickImage}
      />
    </View>
  );
};
