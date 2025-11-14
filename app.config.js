import 'dotenv/config';

const getAppConfig = () => {
  const isDebug = process.env.EAS_BUILD_PROFILE === 'debug';
  const isRelease = process.env.EAS_BUILD_PROFILE === 'release';
  const isDevelopment = !isDebug && !isRelease; // Development mode (expo run:android)
  const isProduction = isRelease || process.env.NODE_ENV === 'production';

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
      icon: './assets/images/icon.webp',
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
        image: './assets/images/splash-icon.webp',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        // Optimize splash screen for smaller APK
        ...(isProduction && {
          // Use smaller splash image in production (WebP is smaller)
          image: './assets/images/splash-icon.webp',
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
          foregroundImage: './assets/images/adaptive-icon.webp',
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
        [
          'expo-location',
          {
            locationAlwaysAndWhenInUsePermission: `Allow ${appName} to use your location.`,
            locationAlwaysPermission: `Allow ${appName} to use your location.`,
            locationWhenInUsePermission: `Allow ${appName} to use your location.`,
            isAndroidBackgroundLocationEnabled: true,
          },
        ],
        // ====================================
        // BARE WORKFLOW - No gradleProperties needed!
        // ====================================
        // All build optimizations are now committed directly in:
        // - android/gradle.properties (all Gradle/Hermes/R8 settings)
        // - android/app/proguard-rules.pro (ProGuard/R8 rules)
        // 
        // Benefits:
        // ✅ Full control over build configuration
        // ✅ No expo prebuild overwriting our settings
        // ✅ What we see locally = what CI builds
        // ✅ Faster CI builds (no prebuild step)
        //
        // The expo-build-properties plugin is still needed for some Expo features,
        // but we don't use it for optimization settings anymore.
        [
          'expo-build-properties',
          {
            android: {
              // These are applied at plugin level (not Gradle)
              enableProguardInReleaseBuilds: true,
              enableShrinkResourcesInReleaseBuilds: true,
              abiFilters: ['arm64-v8a'],
              // Additional APK size optimizations
              ...(isProduction && {
                // Aggressive optimizations for production
                enableHermes: true,
                // Disable unused native libraries
                excludeUnusedPackages: true,
                // Strip unused C++ code
                enableCppOptimizations: true,
                // Optimize native library loading
                optimizeNativeLibs: true,
                // Remove unused architecture support
                useLegacyPackaging: false,
              }),
            },
            ios: isProduction ? {
              // iOS optimizations (if you add iOS later)
              deploymentTarget: '13.4',
              enableHermes: true,
            } : {},
          },
        ],
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
