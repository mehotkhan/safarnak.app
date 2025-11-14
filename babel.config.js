module.exports = function (api) {
  api.cache(true);
  const isProduction = api.env('production');

  return {
    presets: [
      ['babel-preset-expo', {
        jsxImportSource: 'nativewind',
        // Optimize for production
        ...(isProduction && {
          // Disable lazy imports in production for better tree-shaking
          lazyImports: false,
        }),
      }],
      'nativewind/babel',
    ],
    plugins: [
      'react-native-reanimated/plugin',
      // Production-only optimizations
      ...(isProduction ? [
        // Remove development-only code (console statements except errors)
        ['babel-plugin-transform-remove-console', { exclude: ['error'] }],
      ] : []),
      'react-native-worklets/plugin', // MUST be last
    ],
    // Production-specific env settings
    ...(isProduction && {
      env: {
        production: {
          // More aggressive minification
          compact: true,
          // Remove comments
          comments: false,
          // Minimize whitespace
          minified: true,
        },
      },
    }),
  };
};
