import { useUpdateChatRoom } from '@/features/chat-room/api/use-edit-chat-room';
import { RoomForm } from '@/features/chat-room/components/room-form';
import { CreateChatRoomSchema } from '@/features/chat-room/schema';
import { useAuth } from '@/lib/zustand/useAuth';
import { ChannelType } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  initialData: ChannelType;
};
type MimeType = 'image/jpeg' | 'image/png';

export const EditRoom = ({ initialData }: Props) => {
  const { mutateAsync, isSuccess } = useUpdateChatRoom();
  const creatorId = useAuth((state) => state?.user?.id!);

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

  const onSubmit = async (data: CreateChatRoomSchema) => {
    await mutateAsync({
      ...data,
      creatorId,
      channel_id: initialData.$id,
    });

    if (isSuccess) {
      reset();
    }
  };
  const { image, name, description } = watch();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setValue('image', {
        type: result.assets[0].mimeType as MimeType,
        uri: result.assets[0].uri,
        name: new Date().toISOString(),
        size: result.assets[0].fileSize!,
      });
    }
  };
  console.log({ errors });

  const imageUrl = typeof image === 'string' ? image : image?.uri;
  const disabled =
    initialData.channel_name === name &&
    initialData.description === description &&
    initialData.image_url === imageUrl;
  return (
    <RoomForm
      control={control}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      imageUrl={imageUrl}
      pickImage={pickImage}
      btnTitle="Update"
      disabled={disabled}
    />
  );
};
