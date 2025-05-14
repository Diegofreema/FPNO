import { CustomInput } from '@/components/form/custom-input';
import { Button } from '@/components/ui/button';
import { colors } from '@/constants';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/lib/zustand/useAuth';
import { Image } from 'expo-image';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';
import { useCreateChatRoom } from '../api/use-create-chat-room';
import { CreateChatRoomSchema, createChatRoomSchema } from '../schema';

const { width } = Dimensions.get('window');
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
  } = useForm<z.infer<typeof createChatRoomSchema>>({
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
  const imageUrl = image?.uri;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.imageContainer}
          onPress={pickImage}
        >
          {imageUrl ? (
            <Image
              style={{ width: '100%', height: '100%', borderRadius: 1000 }}
              contentFit="cover"
              source={imageUrl}
            />
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Feather color={colors.white} name="image" size={width * 0.2} />
              <View style={styles.abs}>
                <Feather
                  name="camera"
                  color={colors.lightblue}
                  size={width * 0.05}
                />
              </View>
            </View>
          )}
        </TouchableOpacity>
        {errors['image'] && (
          <Text style={{ color: colors.red }}>{errors['image'].message}</Text>
        )}
        <CustomInput
          control={control}
          errors={errors}
          label=""
          name="name"
          placeholder="Room Name"
        />
        <CustomInput
          control={control}
          errors={errors}
          label=""
          name="description"
          placeholder="Describe this room, this will enable people to know what this room is about"
          numberOfLines={5}
          maxLength={200}
          multiline
          style={{
            height: 150,
          }}
          containerStyle={{
            height: 150,
            padding: 5,
          }}
        />
        <Button
          onPress={handleSubmit(onSubmit)}
          text="Create Room"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          style={{
            marginTop: 'auto',
            marginBottom: 20,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  imageContainer: {
    backgroundColor: colors.lightblue,
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  abs: {
    position: 'absolute',
    bottom: 10,
    right: -5,
    backgroundColor: colors.lightGray,
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
