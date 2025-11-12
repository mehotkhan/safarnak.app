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

  // Read version from package.json
  const packageJson = JSON.parse(require('fs').readFileSync('./package.json', 'utf8'));
  const appVersion = packageJson.version;

  // Resolve GraphQL URL once here and expose via extras so runtime can read it reliably
  const isDevRuntime = isDebug || isDevelopment;
  const graphUrl = isDevRuntime
    ? (
        process.env.EXPO_PUBLIC_GRAPHQL_URL_DEV ||
        process.env.EXPO_PUBLIC_GRAPHQL_URL ||
        process.env.GRAPHQL_URL_DEV ||
        process.env.GRAPHQL_URL ||
        // Dev fallback per repo rule (update to your LAN IP when needed)
        'http://192.168.1.51:8787/graphql'
      )
    : (
        process.env.EXPO_PUBLIC_GRAPHQL_URL ||
        process.env.GRAPHQL_URL ||
        'https://safarnak.app/graphql'
      );

  // Mapbox removed from the project

  return {
    expo: {
      name: appName,
      slug: 'safarNak',
      version: appVersion,
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
      android: {
        // Display version (shown in Play Store and app info)
        versionName: appVersion,
        // Internal integer version code (MUST increment for Android to allow updates)
        // Format: maj*10000 + min*100 + pat
        // Examples:
        //   0.6.1 → 601 (0*10000 + 6*100 + 1)
        //   1.2.3 → 12003 (1*10000 + 2*100 + 3)
        //   2.10.5 → 21005 (2*10000 + 10*100 + 5)
        versionCode:
          parseInt(process.env.ANDROID_VERSION_CODE || '0', 10) ||
          (() => {
            const [maj, min, pat] = appVersion.split('.').map(n => parseInt(n, 10) || 0);
            return maj * 10000 + min * 100 + pat;
          })(),
        adaptiveIcon: {
          foregroundImage: './assets/images/adaptive-icon.png',
          backgroundColor: '#ffffff',
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: packageName,
        softwareKeyboardLayoutMode: 'pan',
      },
      web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png',
      },
      plugins: [
        'expo-router',
        'expo-localization',
        [
          'expo-location',
          {
            locationAlwaysAndWhenInUsePermission: `Allow ${appName} to use your location.`,
            locationAlwaysPermission: `Allow ${appName} to use your location.`,
            locationWhenInUsePermission: `Allow ${appName} to use your location.`,
            isAndroidBackgroundLocationEnabled: true,
          },
        ],
        [
          'expo-build-properties',
          {
            android: {
              enableProguardInReleaseBuilds: true,
              enableShrinkResourcesInReleaseBuilds: true,
              abiFilters: ['arm64-v8a'],
              // Ensure code shrinking is enabled when resource shrinking is on (fixes Gradle error)
              // and enforce v8-only builds by default at the Gradle level.
              gradleProperties: {
                'android.enableMinifyInReleaseBuilds': 'true',
                'reactNativeArchitectures': 'arm64-v8a',
                // Smaller JS asset inside APK
                'android.enableBundleCompression': 'true',
                // Drop heavy Fresco extras if not required (saves several MB)
                'expo.gif.enabled': 'false',
                'expo.webp.enabled': 'false',
                'expo.webp.animated': 'false',
              },
            },
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
        // Single source of truth for client GraphQL URL (dev/prod decided above)
        graphqlUrl: graphUrl,
        appName: process.env.APP_NAME || appName,
        appScheme: process.env.APP_SCHEME || scheme,
        bundleIdentifier: process.env.BUNDLE_IDENTIFIER || bundleIdentifier,
        supportsRTL: true,
      },
    },
  };
};

export default getAppConfig();
