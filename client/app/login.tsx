import { CustomText } from '../components/ui/CustomText';
import { View } from '../components/ui/Themed';
import { useAppDispatch } from '../redux/store';
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
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER_MUTATION);

  const loading = loginLoading || registerLoading;

  const handleAuth = async () => {
    if (userName.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      let result;
      
      if (isRegistering) {
        // Register new user
        result = await registerMutation({
          variables: {
            name: userName.trim(),
            email: email.trim(),
            password: password.trim(),
          },
        });
      } else {
        // Login existing user
        result = await loginMutation({
          variables: {
            email: email.trim(),
            password: password.trim(),
          },
        });
      }

      if (result.data) {
        const authData = isRegistering ? result.data.register : result.data.login;
        const { user, token } = authData;
        
        // Store in local Drizzle database
        await db.insert(users).values({
          id: parseInt(user.id),
          name: user.name,
          email: user.email,
        });

        // Update Redux store
        dispatch(login({ user, token }));
        router.replace('/(tabs)');
        
        Alert.alert('Success', isRegistering ? 'Account created successfully!' : 'Logged in successfully!');
      }
    } catch (error: any) {
      console.log('GraphQL auth failed, trying offline mode:', error);
      
      // Offline fallback: create local user
      const localUser = {
        id: Date.now(), // Simple ID generation
        name: userName.trim(),
        email: email.trim(),
      };

      try {
        // Insert into local database
        await db.insert(users).values(localUser);
        
        // Update Redux store with local token
        dispatch(login({ user: localUser, token: 'local' }));
        router.replace('/(tabs)');
        
        Alert.alert('Offline Mode', 'Logged in offline. Data will sync when connection is restored.');
      } catch (dbError) {
        console.error('Database error:', dbError);
        Alert.alert('Error', 'Failed to login offline');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CustomText weight="bold" style={styles.title}>{t('login.title')}</CustomText>
        <CustomText style={styles.subtitle}>{t('login.subtitle')}</CustomText>
        
        {isRegistering && (
          <View style={styles.inputContainer}>
            <CustomText weight="medium" style={styles.label}>Name</CustomText>
            <TextInput
              style={styles.input}
              value={userName}
              onChangeText={setUserName}
              placeholder="Enter your name"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <CustomText weight="medium" style={styles.label}>Email</CustomText>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputContainer}>
          <CustomText weight="medium" style={styles.label}>Password</CustomText>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
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
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={() => setIsRegistering(!isRegistering)}
        >
          <CustomText style={styles.toggleButtonText}>
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
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
});
