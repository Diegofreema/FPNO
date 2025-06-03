import {CustomInput} from "@/components/form/custom-input";
import {Button} from "@/components/ui/button";
import {colors} from "@/constants";
import {Feather} from "@expo/vector-icons";
import {Image} from "expo-image";
import React from "react";
import {Control, FieldErrors, SubmitErrorHandler, SubmitHandler,} from "react-hook-form";
import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {CreateChatRoomSchema} from "../schema";

const { width } = Dimensions.get("window");
type Props = {
  imageUrl?: string;
  isSubmitting: boolean;
  pickImage: () => void;
  errors: FieldErrors<CreateChatRoomSchema>;
  control: Control<CreateChatRoomSchema>;
  handleSubmit: (
    onValid: SubmitHandler<CreateChatRoomSchema>,
    onInvalid?: SubmitErrorHandler<CreateChatRoomSchema> | undefined,
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  onSubmit: (data: CreateChatRoomSchema) => Promise<void>;
  btnTitle?: string;
  disabled?: boolean;
};

export const RoomForm = ({
  imageUrl,
  isSubmitting,
  pickImage,
  control,
  errors,
  handleSubmit,
  onSubmit,
  btnTitle = "Create",
  disabled,
}: Props) => {
  return (
    <ScrollView style={{ flex: 1,  }} contentContainerStyle={{flexGrow: 1}}>
      <View style={{ flex: 1,  }}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.imageContainer}
          onPress={pickImage}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {imageUrl ? (
              <Image
                style={{ width: "100%", height: "100%", borderRadius: 1000 }}
                contentFit="cover"
                source={imageUrl}
              />
            ) : (
              <Feather color={colors.white} name="image" size={width * 0.2} />
            )}

            <View style={styles.abs}>
              <Feather
                name="camera"
                color={colors.lightblue}
                size={width * 0.05}
              />
            </View>
          </View>
        </TouchableOpacity>
        {errors["image"] && (
          <Text style={{ color: colors.red }}>{errors["image"].message}</Text>
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
            height: "100%",
            textAlignVertical: "top",
          }}
          containerStyle={{
            height: 150,
            padding: 5,
          }}
        />
      </View>
      <Button
        onPress={handleSubmit(onSubmit)}
        text={`${btnTitle} Room`}
        isDisabled={isSubmitting || disabled}
        isLoading={isSubmitting}
        style={{

          marginBottom: 20,
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  imageContainer: {
    backgroundColor: colors.lightblue,
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.4,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  abs: {
    position: "absolute",
    bottom: 10,
    right: -5,
    backgroundColor: colors.lightGray,
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
