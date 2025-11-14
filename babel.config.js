module.exports = function () {
  const isProduction =
    process.env.BABEL_ENV === 'production' || process.env.NODE_ENV === 'production';

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
    // Production-specific options
    ...(isProduction && {
      comments: false,
      compact: true,
      minified: true,
    }),
  };
};
