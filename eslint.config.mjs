import js from '@eslint/js'
import importX from 'eslint-plugin-import-x'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'tests/visual/server.mjs',
      'src/assets/localization/languages.generated.ts'
    ]
  },
  js.configs.recommended,
  tseslint.configs.eslintRecommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      import: importX,
      'simple-import-sort': simpleImportSort
    },
    rules: {
      quotes: ['warn', 'single', { allowTemplateLiterals: true }],
      semi: ['warn', 'never'],
      'space-before-function-paren': ['warn', 'always'],
      'comma-dangle': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'func-names': 'off',
      'no-empty-function': 'off',
      'default-case': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-named-as-default': 'error',
      'import/no-cycle': 'error',
      'import/no-deprecated': 'error',
      'no-return-await': 'off',
      'no-use-before-define': ['error', { functions: false }],
      'class-methods-use-this': 'off',
      '@typescript-eslint/return-await': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' }
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
          filter: { regex: 'Route$', match: false }
        }
      ],
      'no-underscore-dangle': ['error', { allowAfterThis: true }],
      'no-debugger': 'error',
      'no-console': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
        }
      ]
    }
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  {
    files: ['dev/**/*.ts'],
    rules: {
      semi: ['warn', 'always'],
      'space-before-function-paren': ['warn', 'never'],
      'no-console': 'warn',
      'no-multiple-empty-lines': 'warn',
      'prefer-const': 'warn',
      quotes: ['warn', 'double'],
      '@typescript-eslint/no-floating-promises': 'off'
    }
  }
)
