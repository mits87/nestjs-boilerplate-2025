module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-shadow': 'off',
    'node/no-extraneous-import': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-magic-numbers': [
      'error', {
        ignoreReadonlyClassProperties: true,
        ignoreNumericLiteralTypes: true,
        ignoreEnums: true,
      },
    ],
    '@typescript-eslint/no-shadow': 'error',
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
        'groups': ['builtin', 'external'],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': false
        },
        'pathGroupsExcludedImportTypes': ['builtin']
      },
    ],
  },
  'overrides': [
    {
      'files': ['*.model.ts', '*.entity.ts', '*.dto.ts', '*.interface.ts'],
      'rules': {
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
        '@typescript-eslint/no-magic-numbers': 'off'
      }
    },
    {
      files: ["**/*.spec.ts", "**/*.e2e-spec.ts"],
      rules: {
        'jest/expect-expect': 'off',
        '@typescript-eslint/no-magic-numbers': 'off'
      }
    }
  ]
};
