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
  StyleSheet,
} from 'react-native';
import Colors from '@constants/Colors';

interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: ImageSourcePropType;
  error?: boolean;
}

export default function InputField({
  label,
  icon,
  secureTextEntry = false,
  error = false,
  ...props
}: InputFieldProps) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <View style={[styles.inputContainer, error && styles.inputContainerError]}>
            {icon && <Image source={icon} style={styles.icon} />}
            <TextInput
              style={styles.input}
              secureTextEntry={secureTextEntry}
              placeholderTextColor="#9ca3af"
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
    color: '#1f2937',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.neutral100,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.light.neutral100,
    paddingHorizontal: 4,
  },
  inputContainerError: {
    borderColor: Colors.light.danger,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#000',
  },
});
