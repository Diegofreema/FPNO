import {RoomForm} from "@/features/chat-room/components/room-form";
import {CreateChatRoomSchema} from "@/features/chat-room/schema";
import {useAuth} from "@/lib/zustand/useAuth";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {useForm} from "react-hook-form";
import {Id} from "@/convex/_generated/dataModel";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {ConvexError} from "convex/values";
import {toast} from "sonner-native";
import {uploadProfilePicture} from "@/helper";
import {useRouter} from "expo-router";

type Props = {
  initialData: {
    description?: string;
    image_url?: string;
    channel_name: string;
    _id: Id<"rooms">;
    image_id?: Id<"_storage">;
  };
};

export const EditRoom = ({ initialData }: Props) => {

  const creatorId = useAuth((state) => state?.user?.convexId!);
  const editRoom = useMutation(api.room.editRoom);
  const generateUploadUrl = useMutation(api.user.generateUploadUrl);
  const router = useRouter()
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    control,
    watch,
    setValue,
  } = useForm<CreateChatRoomSchema>({
    defaultValues: {
      description: initialData?.description,
      image: initialData?.image_url,
      name: initialData.channel_name,
    },
  });

  const { image, name, description } = watch();
  const isNewImage = image !== initialData.image_url;
  console.log({isNewImage})
  const onSubmit = async (data: CreateChatRoomSchema) => {
    try {
      if (isNewImage) {
        const res = await uploadProfilePicture(generateUploadUrl, data.image);
        console.log(res)
        await editRoom({
          room_name: data.name.trim(),
          description: data.description,
          creator_id: creatorId,
          room_id: initialData._id,
          image_id: res?.storageId,
          previous_image_id: initialData.image_id
        });
      } else {
        await editRoom({
          room_name: data.name.trim(),
          description: data.description,
          creator_id: creatorId,
          room_id: initialData._id,
        });

      }
        reset();
        toast.success("Room edited successfully");
        router.back()
    } catch (error) {
      console.log(error);
      const errorMessage =
        error instanceof ConvexError
          ? (error.data as string)
          : "Failed to edit chat room";
      toast.error(errorMessage);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setValue("image", result.assets?.[0]?.uri);
    }
  };
  console.log({ errors });

  const disabled =
    initialData.channel_name === name &&
    initialData.description === description &&
    initialData.image_url === image;
  return (
    <RoomForm
      control={control}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      imageUrl={image}
      pickImage={pickImage}
      btnTitle="Update"
      disabled={disabled}
    />
  );
};
