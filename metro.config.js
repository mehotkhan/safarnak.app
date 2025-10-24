const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for .sql files
config.resolver.sourceExts.push('sql');

// Watch shared folders
config.watchFolders = [path.resolve(__dirname, 'graphql')];

// Exclude worker directory from watching
config.resolver.blockList = [/.*\/worker\/.*/, /.*\/worker\/\.wrangler\/.*/];

// Enable symlinks and node_modules outside the project root
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

// Support for path aliases (@/, @graphql/)
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
  '@graphql': path.resolve(__dirname, 'graphql'),
};

// Enable inline requires for faster cold start in production bundles
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;
