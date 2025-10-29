module.exports = {
  dependencies: {
    'react-native-worklets': {
      platforms: {
        android: null, // Disable Android native module - we only need Babel plugin
        ios: null, // Disable iOS native module - we only need Babel plugin
      },
    },
  },
};

