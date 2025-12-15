import 'dotenv/config';
// Inline config plugin to ensure Android manifest has supportsRtl=true
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { withAndroidManifest } = require('@expo/config-plugins');

const withAndroidRTL = config =>
  withAndroidManifest(config, config => {
    const app = config.modResults.manifest.application?.[0];
    if (app) {
      app.$ = app.$ || {};
      app.$['android:supportsRtl'] = 'true';
    }
    return config;
  });

const getAppConfig = () => {
  // Prefer APP_VARIANT, fall back to EAS_BUILD_PROFILE, default to 'debug'
  const variant = process.env.APP_VARIANT ?? process.env.EAS_BUILD_PROFILE ?? 'debug';
  const isRelease = variant === 'release';
  const isDebug = variant === 'debug';
  
  // Check NODE_ENV for CI/production builds (GitHub Actions sets NODE_ENV=production)
  const isProductionEnv = process.env.NODE_ENV === 'production';
  // In CI, if NODE_ENV=production and variant is not explicitly debug, treat as release
  const isReleaseBuild = isRelease || (isProductionEnv && !isDebug && variant !== 'debug');
  const isDevelopment = !isDebug && !isReleaseBuild; // Development mode (expo run:android)
  const isProduction = isReleaseBuild || isProductionEnv;

  // Default configuration
  let appName = 'سفرناک';
  let bundleIdentifier = 'ir.mohet.safarnak';
  let packageName = 'ir.mohet.safarnak';
  let scheme = 'safarnak';

  // Set specific configurations based on variant (single source of truth)
  if (isRelease) {
    // Release build - use production name and package
    appName = 'سفرناک';
    bundleIdentifier = 'ir.mohet.safarnak';
    packageName = 'ir.mohet.safarnak';
    scheme = 'safarnak';
  } else {
    // Debug/development build - use debug name and package
    appName = 'سفرناک دیباگ';
    bundleIdentifier = 'ir.mohet.safarnak_debug';
    packageName = 'ir.mohet.safarnak_debug';
    scheme = 'safarnak-debug';
  }

  // Override with environment variables if available (after mode detection)
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

  // Read version from package.json
  const packageJson = JSON.parse(require('fs').readFileSync('./package.json', 'utf8'));
  const appVersion = packageJson.version;

  // Resolve GraphQL URL once here and expose via extras so runtime can read it reliably
  // Use isReleaseBuild (not isDevRuntime) to determine production vs dev
  const isDevRuntime = isDebug || isDevelopment;
  const graphUrl = isReleaseBuild
    ? (
        // Production: prefer env vars, fallback to production URL
        process.env.EXPO_PUBLIC_GRAPHQL_URL ||
        process.env.GRAPHQL_URL ||
        'https://safarnak.app/graphql'
      )
    : (
        // Development: prefer dev env vars, fallback to local dev server
        process.env.EXPO_PUBLIC_GRAPHQL_URL_DEV ||
        process.env.EXPO_PUBLIC_GRAPHQL_URL ||
        process.env.GRAPHQL_URL_DEV ||
        process.env.GRAPHQL_URL ||
        // Dev fallback per repo rule (update to your LAN IP when needed)
        'http://192.168.1.51:8787/graphql'
      );

  // Mapbox removed from the project

  return {
    expo: {
      name: appName,
      slug: 'safarNak',
      version: appVersion,
      orientation: 'portrait',
      icon: './assets/images/icon.png', // PNG required for Expo prebuild (jimp-compact doesn't support WebP)
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
        image: './assets/images/splash-icon.png', // PNG required for Expo prebuild (jimp-compact doesn't support WebP)
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        // Optimize splash screen for smaller APK
        ...(isProduction && {
          // Disable splash screen animation in production for faster startup
          enableSplashScreenAnimation: false,
        }),
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
          foregroundImage: './assets/images/adaptive-icon.png', // PNG required for Expo prebuild (jimp-compact doesn't support WebP)
          backgroundColor: '#ffffff',
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: packageName,
        // Prefer resize so the window shrinks and content can layout naturally
        softwareKeyboardLayoutMode: 'resize',
        // Ensure the OS resizes the window when keyboard appears
        windowSoftInputMode: 'adjustResize',
      },
      web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.webp',
      },
      // ====================================
      // PRODUCTION OPTIMIZATIONS
      // ====================================
      ...(isProduction && {
        // Strip unused Expo modules in production
        _internal: {
          // Disable unused Expo features
          isHeadless: false,
          // Disable development features
          enableDevMenu: false,
          // Disable storybook in production
          enableStorybook: false,
        },
      }),
      plugins: [
        'expo-router',
        'expo-localization',
        // Ensure Android supports RTL layouts at the manifest level
        withAndroidRTL,
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
              // REQUIRED by expo-build-properties validation (even though deprecated):
              enableProguardInReleaseBuilds: true,
              // Newer name (preferred, but plugin still requires enableProguardInReleaseBuilds):
              enableMinifyInReleaseBuilds: true,
              // Requires enableProguardInReleaseBuilds to be enabled:
              enableShrinkResourcesInReleaseBuilds: true,
              abiFilters: ['arm64-v8a'],
              ...(isProduction && {
                enableHermes: true,
                excludeUnusedPackages: true,
                enableCppOptimizations: true,
                optimizeNativeLibs: true,
                useLegacyPackaging: false,
                // optionally:
                // enableBundleCompression: true,
              }),
            },
            ios: isProduction ? {
              // iOS optimizations (if you add iOS later)
              deploymentTarget: '13.4',
              enableHermes: true,
            } : {},
          },
        ],
        "@maplibre/maplibre-react-native"
      ],
      experiments: {
        typedRoutes: true,
        // Disable experimental features in production for stability
        ...(isProduction && {
          // Disable experimental features that add bundle size
          turboModules: false,
        }),
      },
      // Production-specific optimizations
      ...(isProduction && {
        // Disable development features in production
        devClient: false,
        // Disable updates in production (we use EAS builds)
        updates: {
          enabled: false,
        },
        // Disable notifications in production (if not needed)
        notification: {
          icon: './assets/images/icon.png',
          color: '#ffffff',
          // Disable notification sounds to reduce APK size
          defaultChannel: 'default',
        },
      }),
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
