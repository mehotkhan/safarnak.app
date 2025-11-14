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

// Production optimizations for smaller APK
const isProduction = process.env.NODE_ENV === 'production' || process.env.EXPO_PUBLIC_ENV === 'production';
if (isProduction) {
  // Aggressive tree-shaking and asset filtering
  config.resolver = {
    ...config.resolver,
    // Block unused asset types that add APK size
    blockList: [
      // Block unused icon fonts (only keep Ionicons)
      /@expo\/vector-icons\/.*\/(?!Ionicons).*\.ttf$/,
      /react-native-vector-icons\/.*\/(?!Ionicons).*\.ttf$/,
      // Block unused image formats in production (keep only PNG/WebP)
      /\.(gif|bmp|tiff|svg)$/,
      // Block development-only assets
      /__tests__\/.*\.(png|jpg|jpeg|gif)$/,
      /test\/.*\.(png|jpg|jpeg|gif)$/,
      // Block large unused assets
      /node_modules\/.*\.(png|jpg|jpeg|gif|mp4|mov|avi|wav|mp3)$/,
    ],
    // Enable aggressive resolution for tree-shaking
    resolveRequest: (context, moduleName, platform) => {
      // Skip dev-only modules in production
      if (moduleName.includes('react-devtools') ||
          moduleName.includes('redux-devtools') ||
          moduleName.includes('flipper')) {
        return { type: 'empty' };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  };

  // Enhanced minification for production
  config.transformer = {
    ...config.transformer,
    // Disable source maps in production for smaller bundle
    enableBabelRCLookup: false,
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
        // More aggressive optimizations
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        // Remove pure getters that don't have side effects
        pure_getters: true,
        // Remove unreachable code after return
        side_effects: true,
      },
      mangle: {
        // Mangle variable names for smaller bundle
        toplevel: true,
        // Keep class names for debugging (set to false for even smaller bundle)
        keep_classnames: false,
        // Keep function names for debugging
        keep_fnames: false,
        // Mangle properties (more aggressive)
        properties: {
          regex: /^_[A-Za-z]/, // Only mangle private properties
        },
      },
      output: {
        // Remove comments
        comments: false,
        // ASCII only (smaller output)
        ascii_only: true,
        // Remove quotes from object keys when possible
        quote_style: 0,
        // More compact output
        beautify: false,
        // Remove semicolons where possible
        semicolons: false,
      },
    },
    // Enable Hermes bytecode optimizations
    enableHermes: true,
    // Disable experimental features in production
    unstable_transformProfile: 'hermes-stable',
  };

  // Production serializer optimizations
  config.serializer = {
    ...config.serializer,
    // Create separate chunks for better caching (but smaller total size)
    createModuleIdFactory: () => {
      return (path) => {
        // Shorter module IDs for smaller bundle
        const hash = require('crypto').createHash('md5').update(path).digest('hex').substring(0, 6);
        return hash;
      };
    },
    // Process modules to remove dev-only code
    processModuleFilter: (modules) => {
      return modules.filter((module) => {
        // Remove modules that are only used in development
        if (module.path.includes('__tests__') ||
            module.path.includes('.test.') ||
            module.path.includes('.spec.')) {
          return false;
        }
        return true;
      });
    },
  };
}

// Use resolver.alias for subpath mapping to ensure Metro resolves correctly
// No aliases required for NativeWind when using default React JSX runtime

module.exports = withNativeWind(config, { input: './global.css' });
