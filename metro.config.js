const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

let config = getDefaultConfig(__dirname);

// Add support for .sql files

// Support for path aliases
const path = require('path');
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
  '@components': path.resolve(__dirname, 'components'),
  '@graphql': path.resolve(__dirname, 'graphql'),
  '@drizzle': path.resolve(__dirname, 'drizzle'),
  '@worker': path.resolve(__dirname, 'worker'),
  '@api': path.resolve(__dirname, 'api'),
  '@store': path.resolve(__dirname, 'store'),
  '@hooks': path.resolve(__dirname, 'hooks'),
  '@constants': path.resolve(__dirname, 'constants'),
  '@locales': path.resolve(__dirname, 'locales'),
};

config = withNativewind(config, { input: './global.css' });

module.exports = config;
