import Constants from 'expo-constants';

// Get app configuration from environment variables or fallback to defaults
export const getAppConfig = () => {
  const extra = Constants.expoConfig?.extra;
  const envAppName = extra?.appName;
  const envAppScheme = extra?.appScheme;

  if (envAppName && envAppScheme) {
    return {
      name: envAppName,
      scheme: envAppScheme,
      version: extra?.appVersion ?? Constants.expoConfig?.version ?? '0.0.0',
    };
  }

  if (extra?.variant === 'dev' || __DEV__) {
    return {
      name: 'سفرناک دیباگ',
      scheme: 'safarnak-debug',
      version: Constants.expoConfig?.version ?? '0.0.0',
    };
  }

  return {
    name: 'سفرناک',
    scheme: 'safarnak',
    version: Constants.expoConfig?.version ?? '0.0.0',
  };
};

export const appConfig = getAppConfig();

// Export individual values for convenience
export const APP_NAME = appConfig.name;
export const APP_SCHEME = appConfig.scheme;
export const APP_VERSION = appConfig.version;
