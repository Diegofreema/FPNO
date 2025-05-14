import { colors } from '@/constants';

import { Feather } from '@expo/vector-icons';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type Props = TextInputProps & {
  label: string;
  placeholder: string;
  password?: boolean;
  toggleSecure?: () => void;
  secureTextEntry?: boolean;
  name: string;
  errors: FieldErrors<any>;
  control: Control<any>;
  type?: KeyboardTypeOptions;
  onEditFinish?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};
export const CustomInput = ({
  label,
  placeholder,
  password,
  toggleSecure,
  secureTextEntry,
  errors,
  name,
  control,
  type = 'default',
  onEditFinish,
  containerStyle,
  ...rest
}: Props) => {
  const onPress = () => {
    if (toggleSecure) {
      toggleSecure();
    }
  };
  const onEndEditing = () => {
    onEditFinish && onEditFinish();
  };
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontFamily: 'NunitoBold' }}>{label}</Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.inputContainer, containerStyle]}>
          <Controller
            control={control}
            render={({ field: { onBlur, value, onChange } }) => (
              <TextInput
                placeholder={placeholder}
                style={[
                  { flex: 1, fontFamily: 'NunitoRegular', fontSize: 15 },
                  rest.style,
                ]}
                placeholderTextColor={colors.gray}
                secureTextEntry={secureTextEntry}
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                keyboardType={type}
                autoCapitalize="none"
                onEndEditing={onEndEditing}
                {...rest}
              />
            )}
            name={name}
          />
          {password && (
            <TouchableOpacity onPress={onPress} style={{ marginRight: 10 }}>
              <Feather
                name={secureTextEntry ? 'eye' : 'eye-off'}
                size={25}
                color={colors.black}
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
      {errors[name] && (
        // @ts-ignore
        <Text style={styles.error}>{errors?.[name]?.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 5,
    height: 55,
  },
  error: {
    fontSize: 15,
    fontFamily: 'NunitoBold',
    color: 'red',
  },
});
