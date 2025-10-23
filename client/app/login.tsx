import { CustomText } from '../components/ui/CustomText';
import { View } from '../components/ui/Themed';
import { useAppDispatch } from '../store/hooks';
import { login } from '../redux/authSlice';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { db } from '../db/database';
import { users } from '@drizzle/schemas/client';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../api/queries';

export default function LoginScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER_MUTATION);

  const loading = loginLoading || registerLoading;

  const testConnection = async () => {
    console.log('🧪 Testing network connection...');
    console.log('🌐 Testing URL: http://192.168.1.51:8787/graphql');
    
    try {
      const response = await fetch('http://192.168.1.51:8787/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'query { __typename }'
        })
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      const data = await response.text();
      console.log('📊 Response data:', data);
      
      if (response.ok) {
        Alert.alert('Connection Test', `✅ Success!\nStatus: ${response.status}\nData: ${data}`);
      } else {
        Alert.alert('Connection Test', `❌ Failed!\nStatus: ${response.status}\nData: ${data}`);
      }
    } catch (error) {
      console.log('💥 Connection test failed:', error);
      Alert.alert('Connection Test', `❌ Error!\n${error.message}`);
    }
  };

  const handleAuth = async () => {
    console.log('🚀 Starting authentication process...');
    console.log('📱 Username:', username);
    console.log('🔒 Password length:', password.length);
    console.log('📝 Mode:', isRegistering ? 'REGISTER' : 'LOGIN');
    
    if (username.trim().length === 0 || password.trim().length === 0) {
      console.log('❌ Validation failed: Empty fields');
      Alert.alert(t('login.errors.title'), t('login.errors.fieldsRequired'));
      return;
    }

    console.log('✅ Validation passed, attempting GraphQL request...');
    console.log('🌐 GraphQL URI:', __DEV__ ? 'http://192.168.1.51:8787/graphql' : 'Production URL');

    try {
      let result;
      
      if (isRegistering) {
        console.log('📝 Attempting REGISTER mutation...');
        result = await registerMutation({
          variables: {
            username: username.trim(),
            password: password.trim(),
          },
        });
        console.log('✅ Register mutation completed:', result);
      } else {
        console.log('🔑 Attempting LOGIN mutation...');
        result = await loginMutation({
          variables: {
            username: username.trim(),
            password: password.trim(),
          },
        });
        console.log('✅ Login mutation completed:', result);
      }

      if (result.data) {
        console.log('📊 GraphQL response data:', JSON.stringify(result.data, null, 2));
        const authData = isRegistering ? result.data.register : result.data.login;
        const { user, token } = authData;
        
        console.log('👤 User data:', JSON.stringify(user, null, 2));
        console.log('🎫 Token received:', token ? 'YES' : 'NO');
        
        // Store in local Drizzle database
        console.log('💾 Storing user in local database...');
        await db.insert(users).values({
          id: parseInt(user.id),
          name: user.name,
          username: user.username,
        });
        console.log('✅ User stored in local database');

        // Update Redux store
        console.log('🔄 Updating Redux store...');
        dispatch(login({ user, token }));
        console.log('✅ Redux store updated');
        
        console.log('🏠 Navigating to main app...');
        router.replace('/(tabs)');
        
        Alert.alert(
          t('login.success.title'), 
          isRegistering ? t('login.success.registerSuccess') : t('login.success.loginSuccess')
        );
        console.log('🎉 Authentication completed successfully!');
      } else {
        console.log('❌ No data in GraphQL response:', result);
      }
    } catch (error: any) {
      console.log('💥 GraphQL request failed!');
      console.log('🔍 Error type:', typeof error);
      console.log('📋 Error message:', error.message);
      console.log('🌐 Network error:', error.networkError);
      console.log('📊 GraphQL errors:', error.graphQLErrors);
      console.log('🔗 Error details:', JSON.stringify(error, null, 2));
      
      // Check if it's a user not found error
      if (error.message && error.message.includes('Invalid username or password')) {
        console.log('👤 User not found error detected');
        Alert.alert(t('login.errors.title'), t('login.errors.userNotFound'));
        return;
      }
      
      // Check if it's a user already exists error
      if (error.message && error.message.includes('already exists')) {
        console.log('👤 User already exists error detected');
        Alert.alert(t('login.errors.title'), t('login.errors.userExists'));
        return;
      }
      
      // Check if it's a network error
      if (error.networkError || error.message.includes('Network')) {
        console.log('🌐 Network error detected');
        Alert.alert(t('login.errors.title'), t('login.errors.networkError'));
        return;
      }
      
      // For other errors, try offline mode
      console.log('🔄 Attempting offline fallback...');
      const localUser = {
        id: Date.now(), // Simple ID generation
        name: username.trim(),
        username: username.trim(),
      };
      console.log('👤 Creating local user:', localUser);

      try {
        // Insert into local database
        console.log('💾 Inserting local user into database...');
        await db.insert(users).values(localUser);
        console.log('✅ Local user inserted successfully');
        
        // Update Redux store with local token
        console.log('🔄 Updating Redux store with local token...');
        dispatch(login({ user: localUser, token: 'local' }));
        console.log('✅ Redux store updated with local data');
        
        console.log('🏠 Navigating to main app (offline mode)...');
        router.replace('/(tabs)');
        
        Alert.alert(t('login.success.offlineMode'), t('login.success.offlineMessage'));
        console.log('🎉 Offline authentication completed!');
      } catch (dbError) {
        console.log('💥 Database error in offline mode!');
        console.log('📋 Database error:', dbError);
        Alert.alert(t('login.errors.title'), t('login.errors.offlineError'));
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CustomText weight="bold" style={styles.title}>{t('login.title')}</CustomText>
        <CustomText style={styles.subtitle}>{t('login.subtitle')}</CustomText>
        
        <View style={styles.inputContainer}>
          <CustomText weight="medium" style={styles.label}>{t('login.usernameLabel')}</CustomText>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder={t('login.usernamePlaceholder')}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputContainer}>
          <CustomText weight="medium" style={styles.label}>{t('login.passwordLabel')}</CustomText>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={t('login.passwordPlaceholder')}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleAuth}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleAuth}
          disabled={loading}
        >
          <CustomText weight="medium" style={styles.buttonText}>
            {loading ? t('login.processing') : (isRegistering ? t('login.registerButton') : t('login.loginButton'))}
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={() => setIsRegistering(!isRegistering)}
        >
          <CustomText style={styles.toggleButtonText}>
            {isRegistering ? t('login.toggleToLogin') : t('login.toggleToRegister')}
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.testButton]} 
          onPress={testConnection}
        >
          <CustomText weight="medium" style={styles.buttonText}>
            🧪 Test Connection
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#2f95dc',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#2f95dc',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  testButton: {
    backgroundColor: '#ff6b6b',
    marginTop: 10,
  },
});
