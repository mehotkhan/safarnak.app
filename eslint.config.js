import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Base JavaScript configuration
  js.configs.recommended,

  // Global ignores
  {
    ignores: [
      'node_modules/**',
      'android/**',
      'ios/**',
      '.expo/**',
      '.wrangler/**',
      'dist/**',
      'build/**',
      '*.config.js',
      'metro.config.js',
      'babel.config.js',
      'drizzle.config.ts',
      'db-manager.js',
      'scripts/**',
      'client/.expo/**',
    ],
  },

  // TypeScript configuration for all TS/TSX files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react: react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      prettier: prettier,
    },
    rules: {
      // TypeScript rules
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'off', // Allow require() for compatibility

      // React rules
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // React Native specific rules
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': 'off', // Can be too strict for some cases

      // Import rules
      'import/order': 'off', // Disable for now due to resolver issues
      'import/no-unresolved': 'off', // TypeScript handles this
      'import/extensions': 'off',

      // Accessibility rules (relaxed for React Native)
      'jsx-a11y/accessible-emoji': 'off',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/click-events-have-key-events': 'off', // Not applicable to React Native
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/html-has-lang': 'off', // Not applicable to React Native
      'jsx-a11y/iframe-has-title': 'off', // Not applicable to React Native
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/no-access-key': 'off', // Not applicable to React Native
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',

      // General rules
      'no-console': 'off', // Allow console for development
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Handled by TypeScript
      'prefer-const': 'error',
      'no-var': 'error',
      'no-undef': 'off', // TypeScript handles this

      // Prettier integration
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },

  // Worker-specific configuration (Cloudflare Workers)
  {
    files: ['worker.ts', 'worker/**/*.ts'],
    languageOptions: {
      globals: {
        // Cloudflare Workers globals
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        crypto: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        addEventListener: 'readonly',
        removeEventListener: 'readonly',
        dispatchEvent: 'readonly',
        // D1 Database globals
        D1Database: 'readonly',
        DurableObjectNamespace: 'readonly',
        DurableObject: 'readonly',
        ExecutionContext: 'readonly',
        // Base64 encoding/decoding
        btoa: 'readonly',
        atob: 'readonly',
      },
    },
    rules: {
      // Worker-specific rules
      'no-restricted-globals': [
        'error',
        {
          name: 'window',
          message: 'window is not available in Cloudflare Workers',
        },
        {
          name: 'document',
          message: 'document is not available in Cloudflare Workers',
        },
        {
          name: 'localStorage',
          message: 'localStorage is not available in Cloudflare Workers',
        },
        {
          name: 'sessionStorage',
          message: 'sessionStorage is not available in Cloudflare Workers',
        },
      ],
    },
  },

  // Client-specific configuration (React Native/Expo)
  {
    files: [
      'app/**/*.tsx',
      'components/**/*.tsx',
      'api/**/*.ts',
      'hooks/**/*.ts',
      'store/**/*.ts',
      'redux/**/*.ts',
    ],
    languageOptions: {
      globals: {
        // React Native globals
        __DEV__: 'readonly',
        global: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        // Expo globals
        expo: 'readonly',
        ExpoModulesCore: 'readonly',
      },
    },
    rules: {
      // Client-specific rules
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
    },
  },

  // Prettier configuration (must be last)
  prettierConfig,
];
