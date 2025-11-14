module.exports = function (api) {
  // Standard Expo pattern: explicitly configure Babel caching
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Keep only stable, widely-used plugins
      'react-native-reanimated/plugin',
      'react-native-worklets/plugin', // MUST be last
    ],
  };
};
