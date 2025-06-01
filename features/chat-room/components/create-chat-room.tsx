import {zodResolver} from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {useForm} from 'react-hook-form';

import {useAuth} from '@/lib/zustand/useAuth';
import {View} from 'react-native';
import {useCreateChatRoom} from '../api/use-create-chat-room';
import {CreateChatRoomSchema, createChatRoomSchema} from '../schema';
import {RoomForm} from './room-form';

type MimeType = 'image/jpeg' | 'image/png';
export const CreateChatRoom = () => {
  const { mutateAsync } = useCreateChatRoom();
  const user = useAuth((state) => state.user);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    watch,
  } = useForm<CreateChatRoomSchema>({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: zodResolver(createChatRoomSchema),
  });
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });
    console.log('image url',result?.assets?.[0].uri)
    if (!result.canceled) {
      setValue('image', {
        type: result.assets[0].mimeType as MimeType,
        uri: result.assets[0].uri,
        name: new Date().toISOString(),
        size: result.assets[0].fileSize!,
      });
    }
  };
  const onSubmit = async (data: CreateChatRoomSchema) => {
    await mutateAsync({ ...data, creatorId: user?.id! });
  };
  const { image } = watch();
  const imageUrl = typeof image === 'string' ? image : image?.uri;

  return (
    <View style={{ flex: 1 }}>
      <RoomForm
        imageUrl={imageUrl}
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
