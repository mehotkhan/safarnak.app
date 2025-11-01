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
import { Ionicons } from '@expo/vector-icons';
import { I18nManager } from 'react-native';

interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: ImageSourcePropType | string; // Support both image source and icon name
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
  const renderIcon = () => {
    if (!icon) return null;
    
    if (typeof icon === 'string') {
      // It's an icon name, use Ionicons
      return (
        <Ionicons
          name={icon as any}
          size={20}
          color="#6b7280"
          style={{ marginStart: 16, transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
        />
      );
    } else {
      // It's an image source
      return <Image source={icon} className={`w-6 h-6 ${iconStyle}`} style={{ marginStart: 16, transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }} />;
    }
  };
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`my-2 w-full ${className}`}>
          {label && <Text className={`text-xl mb-3 ${labelStyle}`}>{label}</Text>}
          <View
            className={`justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 ${containerStyle}`}
            style={{ flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}
          >
            {renderIcon()}
            <TextInput
              className={`rounded-full p-4 text-black text-[15px] flex-1 ${inputStyle} placeholder:text-neutral-500`}
              secureTextEntry={secureTextEntry}
              style={{ textAlign: I18nManager.isRTL ? 'right' : 'left' }}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
