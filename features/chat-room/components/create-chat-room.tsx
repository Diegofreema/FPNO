import { CustomInput } from '@/components/form/custom-input';
import { Button } from '@/components/ui/button';
import { colors } from '@/constants';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import { createChatRoomSchema } from '../schema';

const { width } = Dimensions.get('window');
type MimeType = 'image/jpeg' | 'image/png';
export const CreateChatRoom = () => {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
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

    console.log(result);

    if (!result.canceled) {
      setValue('image', {
        type: result.assets[0].mimeType as MimeType,
        uri: result.assets[0].uri,
        name: result.assets[0].fileName!,
        size: result.assets[0].fileSize!,
      });
    }
  };
  const onSubmit = (data: z.infer<typeof createChatRoomSchema>) => {
    console.log(data);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.imageContainer}
          onPress={pickImage}
        >
          <Feather color={colors.white} name="image" size={width * 0.2} />
          <View style={styles.abs}>
            <Feather
              name="camera"
              color={colors.lightblue}
              size={width * 0.05}
            />
          </View>
        </TouchableOpacity>
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
