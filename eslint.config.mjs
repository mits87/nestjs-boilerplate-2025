// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginImportPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('typescript-eslint').ConfigArray} */
const config = tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'node_modules',
      'dist',
      'build',
      'coverage',
      'coverage-integration',
      '*.d.ts',
      'src/sdk',
      'src/metadata.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      import: eslintPluginImportPlugin,
    },
  },
  {
    rules: {
      'no-shadow': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignoreReadonlyClassProperties: true,
          ignoreNumericLiteralTypes: true,
          ignoreEnums: true,
        },
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: {
            memberTypes: [
              'public-field',
              'protected-field',
              'private-field',
              'field',
              'constructor',
              'method',
              'public-method',
              'protected-method',
              'private-method',
            ],
            order: 'alphabetically',
          },
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
          },
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
          },
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
    },
  },
  {
    files: ['**/*.dto.ts', '**/*.interface.ts'],
    rules: {
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          overrides: {
            constructors: 'no-public',
            properties: 'off',
          },
        },
      ],
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
    rules: {
      'jest/expect-expect': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
    },
  },
);

export default config;