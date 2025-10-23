import 'dotenv/config';

const getAppConfig = () => {
  const isDebug = process.env.EAS_BUILD_PROFILE === 'debug';
  const isRelease = process.env.EAS_BUILD_PROFILE === 'release';
  
  // Default configuration
  let appName = 'Safarnak';
  let bundleIdentifier = 'com.mehotkhan.safarnak';
  let packageName = 'com.mehotkhan.safarnak';
  let scheme = 'safarnak';
  
  // Override with environment variables if available
  if (process.env.APP_NAME) {
    appName = process.env.APP_NAME;
  }
  
  if (process.env.BUNDLE_IDENTIFIER) {
    bundleIdentifier = process.env.BUNDLE_IDENTIFIER;
    packageName = process.env.BUNDLE_IDENTIFIER;
  }
  
  if (process.env.APP_SCHEME) {
    scheme = process.env.APP_SCHEME;
  }
  
  // Set specific configurations for debug and release
  if (isDebug) {
    appName = 'تسفرناک';
    bundleIdentifier = 'ir.mohet.safarnak_debug';
    packageName = 'ir.mohet.safarnak_debug';
    scheme = 'safarnak-debug';
  } else if (isRelease) {
    appName = 'سقرناک';
    bundleIdentifier = 'ir.mohet.safarnak';
    packageName = 'ir.mohet.safarnak';
    scheme = 'safarnak';
  }

  return {
    expo: {
      name: appName,
      slug: 'safarnak',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/images/icon.png',
      scheme: scheme,
      userInterfaceStyle: 'automatic',
      newArchEnabled: false,
      splash: {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: bundleIdentifier
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/images/adaptive-icon.png',
          backgroundColor: '#ffffff'
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: packageName
      },
      web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png'
      },
      plugins: [
        'expo-router',
        [
          'expo-location',
          {
            locationAlwaysAndWhenInUsePermission: `Allow ${appName} to use your location.`,
            locationAlwaysPermission: `Allow ${appName} to use your location.`,
            locationWhenInUsePermission: `Allow ${appName} to use your location.`,
            isIosBackgroundLocationEnabled: true,
            isAndroidBackgroundLocationEnabled: true
          }
        ]
      ],
      experiments: {
        typedRoutes: true
      },
      extra: {
        router: {},
        eas: {
          projectId: '90632384-6918-4b7a-bbab-e0998b4a4b63'
        },
        graphqlUrl: process.env.GRAPHQL_URL || 'http://192.168.1.51:8787/graphql'
      }
    }
  };
};

export default getAppConfig();
