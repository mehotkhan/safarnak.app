const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .sql files

// Support for path aliases
const path = require('path');
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
  '@components': path.resolve(__dirname, 'components'),
  '@graphql': path.resolve(__dirname, 'graphql'),
  '@drizzle': path.resolve(__dirname, 'drizzle'),
  '@worker': path.resolve(__dirname, 'worker'),
};

module.exports = config;
