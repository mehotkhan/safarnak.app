import Constants from 'expo-constants';

// Get app configuration from environment variables or fallback to defaults
export const getAppConfig = () => {
  const envAppName = Constants.expoConfig?.extra?.APP_NAME;
  const envAppScheme = Constants.expoConfig?.extra?.APP_SCHEME;
  
  if (envAppName && envAppScheme) {
    return {
      name: envAppName,
      scheme: envAppScheme,
    };
  }
  
  // Fallback configuration
  if (__DEV__) {
    return {
      name: 'Safarnak Dev',
      scheme: 'safarnak-dev',
    };
  } else {
    return {
      name: 'Safarnak',
      scheme: 'safarnak',
    };
  }
};

export const appConfig = getAppConfig();

// Export individual values for convenience
export const APP_NAME = appConfig.name;
export const APP_SCHEME = appConfig.scheme;

console.log('App Config:', appConfig);
