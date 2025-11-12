const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

let config = getDefaultConfig(__dirname);

// Add support for .sql files

// Support for path aliases
const path = require('path');
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
  // Polyfill buffer for react-native-quick-crypto
  buffer: require.resolve('buffer'),
};

// ====================================
// APK SIZE OPTIMIZATIONS
// ====================================

// Only include Ionicons from @expo/vector-icons (saves ~1.5MB)
config.resolver.alias = {
  ...config.resolver.alias,
  '@expo/vector-icons': path.resolve(__dirname, 'node_modules/@expo/vector-icons'),
};

// Exclude unused icon fonts to reduce bundle size
config.resolver.blockList = [
  ...(config.resolver.blockList || []),
  // Block all vector-icons fonts except Ionicons
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/AntDesign\.ttf$/,
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/Entypo\.ttf$/,
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/EvilIcons\.ttf$/,
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/Feather\.ttf$/,
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/FontAwesome\.ttf$/,
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/FontAwesome5.*\.ttf$/,
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/Fontisto\.ttf$/,
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/Foundation\.ttf$/,
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/MaterialCommunityIcons\.ttf$/,
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/MaterialIcons\.ttf$/,
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/Octicons\.ttf$/,
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/SimpleLineIcons\.ttf$/,
  /node_modules\/@expo\/vector-icons\/build\/vendor\/react-native-vector-icons\/Fonts\/Zocial\.ttf$/,
];

// Production optimizations
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  // Minify for production
  config.transformer = {
    ...config.transformer,
    minifierConfig: {
      compress: {
        // Drop console statements in production
        drop_console: true,
        drop_debugger: true,
        // Remove dead code
        dead_code: true,
        // Remove unused code
        unused: true,
        // Evaluate constant expressions
        evaluate: true,
        // Join consecutive var statements
        join_vars: true,
        // Apply optimizations for booleans
        booleans: true,
        // Optimize loops when possible
        loops: true,
        // Collapse single-use vars
        collapse_vars: true,
        // Reduce variables
        reduce_vars: true,
        // Remove unreachable code
        conditionals: true,
        // Inline functions when possible
        inline: 2,
      },
      mangle: {
        // Mangle variable names for smaller bundle
        toplevel: true,
        // Keep class names for debugging
        keep_classnames: false,
        // Keep function names for debugging
        keep_fnames: false,
      },
      output: {
        // Remove comments
        comments: false,
        // ASCII only (smaller output)
        ascii_only: true,
      },
    },
  };
}

// Use resolver.alias for subpath mapping to ensure Metro resolves correctly
// No aliases required for NativeWind when using default React JSX runtime

module.exports = withNativeWind(config, { input: './global.css' });
