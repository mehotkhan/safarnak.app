import 'dotenv/config';

const getAppConfig = () => {
  const isDebug = process.env.EAS_BUILD_PROFILE === 'debug';
  const isRelease = process.env.EAS_BUILD_PROFILE === 'release';
  const isDevelopment = !isDebug && !isRelease; // Development mode (expo run:android)

  // Default configuration
  let appName = 'سفرناک';
  let bundleIdentifier = 'ir.mohet.safarnak';
  let packageName = 'ir.mohet.safarnak';
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

  // Set specific configurations for different modes
  if (isDebug) {
    appName = 'سفرناک دیباگ';
    bundleIdentifier = 'ir.mohet.safarnak_debug';
    packageName = 'ir.mohet.safarnak_debug';
    scheme = 'safarnak-debug';
  } else if (isRelease) {
    appName = 'سفرناک';
    bundleIdentifier = 'ir.mohet.safarnak';
    packageName = 'ir.mohet.safarnak';
    scheme = 'safarnak';
  } else if (isDevelopment) {
    // Development mode - use debug configuration for Persian name
    appName = 'سفرناک دیباگ';
    bundleIdentifier = 'ir.mohet.safarnak_debug';
    packageName = 'ir.mohet.safarnak_debug';
    scheme = 'safarnak-debug';
  }

  return {
    expo: {
      name: appName,
      slug: 'safarNak',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/images/icon.png',
      scheme: scheme,
      userInterfaceStyle: 'automatic',
      // Enable New Architecture for debug and local development builds, or when explicitly overridden
      // Set NEW_ARCH=1 (or 'true') to force-enable in any profile
      newArchEnabled:
        process.env.NEW_ARCH === '1' ||
        process.env.NEW_ARCH === 'true' ||
        isDebug ||
        isDevelopment,
      splash: {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: bundleIdentifier,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/images/adaptive-icon.png',
          backgroundColor: '#ffffff',
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: packageName,
      },
      web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png',
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
            isAndroidBackgroundLocationEnabled: true,
          },
        ],
      ],
      experiments: {
        typedRoutes: true,
      },
      extra: {
        router: {},
        eas: {
          projectId: '90632384-6918-4b7a-bbab-e0998b4a4b63',
        },
        graphqlUrl:
          process.env.GRAPHQL_URL || 'https://safarnak.mohet.ir/graphql',
        appName: process.env.APP_NAME || appName,
        appScheme: process.env.APP_SCHEME || scheme,
        bundleIdentifier: process.env.BUNDLE_IDENTIFIER || bundleIdentifier,
      },
    },
  };
};

export default getAppConfig();
