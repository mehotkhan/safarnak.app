const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for .sql files
config.resolver.sourceExts.push('sql');

// Watch folders outside the client directory for shared code
config.watchFolders = [
  path.resolve(__dirname, '../drizzle'), // Watch drizzle folder
  path.resolve(__dirname, '../graphql'), // Watch graphql folder
];

// Exclude worker directory from watching
config.resolver.blockList = [
  /.*\/worker\/.*/, // Block worker directory
  /.*\/worker\/\.wrangler\/.*/, // Block worker .wrangler directory
];

// Enable symlinks and node_modules outside the project root
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../node_modules'),
];

// Support for path aliases (@/, @drizzle/, @graphql/)
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
  '@drizzle': path.resolve(__dirname, '../drizzle'),
  '@graphql': path.resolve(__dirname, '../graphql'),
};

module.exports = config;