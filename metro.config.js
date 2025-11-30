const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

let config = getDefaultConfig(__dirname);

// Add support for .sql files (for Drizzle migrations)
config.resolver.sourceExts.push('sql');

// Add migrations directory to watchFolders so Metro can resolve migration files
if (!config.watchFolders) {
  config.watchFolders = [];
}
config.watchFolders.push(path.resolve(__dirname, 'migrations'));
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
  '@ui': path.resolve(__dirname, 'ui'),
  '@graphql': path.resolve(__dirname, 'graphql'),
  '@database': path.resolve(__dirname, 'database'),
  '@worker': path.resolve(__dirname, 'worker'),
  '@api': path.resolve(__dirname, 'api'),
  '@state': path.resolve(__dirname, 'ui/state'),
  '@hooks': path.resolve(__dirname, 'ui/hooks'),
  '@constants': path.resolve(__dirname, 'constants'),
  '@locales': path.resolve(__dirname, 'locales'),
  '@assets': path.resolve(__dirname, 'assets'),
  '@migrations': path.resolve(__dirname, 'migrations'),
  // Polyfill buffer for react-native-quick-crypto
  buffer: require.resolve('buffer'),
};

// ====================================
// APK SIZE OPTIMIZATIONS
// ====================================

// Production optimizations for smaller APK (keep minimal/safe overrides)
const isProduction =
  process.env.NODE_ENV === 'production' || process.env.EXPO_PUBLIC_ENV === 'production';
if (isProduction) {
  // Enhanced minification for production (do not change Babel lookup/caching)
  config.transformer = {
    ...config.transformer,
    minifierConfig: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      mangle: {
        toplevel: true
      },
      output: {
        comments: false,
        ascii_only: true
      },
    },
  };
}

// Use resolver.alias for subpath mapping to ensure Metro resolves correctly
// No aliases required for NativeWind when using default React JSX runtime

module.exports = withNativeWind(config, { input: './global.css' });
