// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require('dotenv');
// Inline config plugin to ensure Android manifest has supportsRtl=true
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { withAndroidManifest } = require('@expo/config-plugins');

const initialEnv = { ...process.env };

const loadEnvFile = fileName => {
  if (fs.existsSync(fileName)) {
    const parsed = dotenv.parse(fs.readFileSync(fileName));
    for (const [key, value] of Object.entries(parsed)) {
      if (initialEnv[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
};

loadEnvFile('.env');
loadEnvFile('.env.local');

const DEFAULT_GRAPHQL_URLS = {
  dev: 'http://192.168.1.51:8787/graphql',
  prod: 'https://safarnak.app/graphql',
};

const normalizeVariant = value => {
  if (['prod', 'production', 'release'].includes(value)) {
    return 'prod';
  }
  return 'dev';
};

const resolveVariant = () => {
  const rawVariant =
    process.env.APP_VARIANT ??
    process.env.EXPO_PUBLIC_APP_VARIANT ??
    process.env.EAS_BUILD_PROFILE ??
    'dev';
  return normalizeVariant(rawVariant);
};

const requireClientUrl = variant => {
  const value = process.env.EXPO_PUBLIC_GRAPHQL_URL || DEFAULT_GRAPHQL_URLS[variant];

  if (variant === 'prod' && /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(value)) {
    throw new Error(
      `Production builds must not use a local EXPO_PUBLIC_GRAPHQL_URL. Current value: ${value}`,
    );
  }

  return value;
};

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
  const variant = resolveVariant();
  const isProduction = variant === 'prod';

  const appName = variant === 'prod' ? 'سفرناک' : 'سفرناک دیباگ';
  const bundleIdentifier = variant === 'prod' ? 'ir.mohet.safarnak' : 'ir.mohet.safarnak_debug';
  const packageName = bundleIdentifier;
  const scheme = variant === 'prod' ? 'safarnak' : 'safarnak-debug';

  // Allow environment variable overrides
  const finalAppName = process.env.APP_NAME || appName;
  const finalBundleIdentifier = process.env.BUNDLE_IDENTIFIER || bundleIdentifier;
  const finalPackageName = process.env.BUNDLE_IDENTIFIER || packageName;
  const finalScheme = process.env.APP_SCHEME || scheme;

  // APP_VERSION is the release pipeline override; package.json is the local fallback.
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const appVersion = process.env.APP_VERSION || packageJson.version;

  const graphUrl = requireClientUrl(variant);

  // Mapbox removed from the project

  return {
    expo: {
      name: finalAppName,
      slug: 'safarNak',
      version: appVersion,
      orientation: 'portrait',
      icon: './assets/images/icon.png',
      scheme: finalScheme,
      userInterfaceStyle: 'automatic',
      // Enable New Architecture for debug and local development builds, or when explicitly overridden
      // Set NEW_ARCH=1 (or 'true') to force-enable in any profile
      newArchEnabled:
        process.env.NEW_ARCH === '1' ||
        process.env.NEW_ARCH === 'true' ||
        variant === 'dev',
      splash: {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        ...(isProduction && {
          enableSplashScreenAnimation: false, // Faster startup in production
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
          foregroundImage: './assets/images/adaptive-icon.png',
          backgroundColor: '#ffffff',
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: finalPackageName,
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
            locationAlwaysAndWhenInUsePermission: `Allow ${finalAppName} to use your location.`,
            locationAlwaysPermission: `Allow ${finalAppName} to use your location.`,
            locationWhenInUsePermission: `Allow ${finalAppName} to use your location.`,
            isAndroidBackgroundLocationEnabled: true,
          },
        ],
        [
          'expo-build-properties',
          {
            android: {
              // Core build optimizations (already in gradle.properties)
              enableProguardInReleaseBuilds: true,
              enableMinifyInReleaseBuilds: true,
              enableShrinkResourcesInReleaseBuilds: true,
              abiFilters: ['arm64-v8a'], // Single architecture for smaller APK
              enableHermes: true, // Modern JS engine
              useLegacyPackaging: false, // Modern packaging
            },
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
        appVersion,
        appName: finalAppName,
        appScheme: finalScheme,
        bundleIdentifier: finalBundleIdentifier,
        supportsRTL: true,
        variant,
        environment: isProduction ? 'production' : 'development',
      },
    },
  };
};

export default getAppConfig();
