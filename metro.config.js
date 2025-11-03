const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

let config = getDefaultConfig(__dirname);

// Add support for .sql files

// Support for path aliases
const path = require('path');
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
  '@components': path.resolve(__dirname, 'components'),
  '@graphql': path.resolve(__dirname, 'graphql'),
  '@database': path.resolve(__dirname, 'database'),
  '@drizzle': path.resolve(__dirname, 'drizzle'),
  '@worker': path.resolve(__dirname, 'worker'),
  '@api': path.resolve(__dirname, 'api'),
  '@store': path.resolve(__dirname, 'store'),
  '@hooks': path.resolve(__dirname, 'hooks'),
  '@constants': path.resolve(__dirname, 'constants'),
  '@locales': path.resolve(__dirname, 'locales'),
  '@assets': path.resolve(__dirname, 'assets'),
};

// Use resolver.alias for subpath mapping to ensure Metro resolves correctly
// No aliases required for NativeWind when using default React JSX runtime

module.exports = withNativeWind(config, { input: './global.css' });
