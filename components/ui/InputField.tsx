import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TextInputProps,
  ImageSourcePropType,
} from 'react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: ImageSourcePropType;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

export default function InputField({
  label,
  icon,
  secureTextEntry = false,
  labelStyle = '',
  containerStyle = '',
  inputStyle = '',
  iconStyle = '',
  className = '',
  ...props
}: InputFieldProps) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`my-2 w-full ${className}`}>
          <Text className={`text-xl mb-3 ${labelStyle}`}>{label}</Text>
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 ${containerStyle}`}
          >
            {icon && <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />}
            <TextInput
              className={`rounded-full p-4 text-black text-[15px] flex-1 ${inputStyle} text-left placeholder:text-neutral-500`}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
