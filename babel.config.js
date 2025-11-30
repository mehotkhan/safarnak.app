module.exports = function (api) {
  // Standard Expo pattern: explicitly configure Babel caching
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Use explicit package name so Babel/Node can always resolve it in CI builds
      ['babel-plugin-inline-import', { extensions: ['.sql'] }], // Bundle SQL migration files
      // Keep only stable, widely-used plugins
      'react-native-reanimated/plugin',
      'react-native-worklets/plugin', // MUST be last
    ],
  };
};
