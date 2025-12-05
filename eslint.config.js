import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default tseslint.config(
  {
    ignores: [
      'dist',
      '**/node_modules/**',
      '*.js',
      '**/*.js',
      '*.cjs',
      '**/*.cjs',
      '*.mjs',
      '**/*.mjs',
      '*.config.*',
      '**/*.config.*',
      'eslint.config.js',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      reactPlugin.configs.flat.recommended,
    ],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
);
