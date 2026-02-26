const globals = require('globals');

module.exports = [
  {
    ignores: [
      'dist-js',
      'dist',
      'renderer/.next',
      'renderer/out',
      'renderer/next.config.js',
      'renderer/components/preferences/categories/general.js',
    ],
  },
  {
    space: 2,
    react: true,
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Fix: XO doesn't apply space variant to React JSX rules
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],

      // Import rules (renamed from import/ to import-x/)
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-unassigned-import': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-anonymous-default-export': 'off',
      'import-x/extensions': 'off',
      'import-x/order': 'off',
      'import-x/first': 'off',
      'import-x/newline-after-import': 'off',

      // React rules
      'react/jsx-closing-tag-location': 'off',
      'react/require-default-props': 'off',
      'react/jsx-curly-brace-presence': 'off',
      'react/static-property-placement': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/boolean-prop-naming': 'off',
      'react/function-component-definition': 'off',
      'react/no-unknown-property': 'off',
      'react/jsx-no-leaked-render': 'off',
      'react/no-object-type-as-default-prop': 'off',
      'react/jsx-no-constructed-context-values': 'off',
      'react/hook-use-state': 'off',
      'react/prefer-read-only-props': 'off',
      'react/no-unused-prop-types': 'off',
      'react/prop-types': 'off',

      // Unicorn rules
      'unicorn/prefer-set-has': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-export-from': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/prefer-code-point': 'off',
      'unicorn/prefer-event-target': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'off',
      'unicorn/prefer-object-from-entries': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/no-object-as-default-parameter': 'off',
      'unicorn/no-unnecessary-slice-end': 'off',
      'unicorn/no-useless-spread': 'off',
      'unicorn/consistent-existence-index-check': 'off',
      'unicorn/switch-case-braces': 'off',

      // Node rules
      'n/file-extension-in-import': 'off',
      'n/no-extraneous-import': 'off',
      'n/prefer-global/buffer': 'off',
      'n/prefer-global/process': 'off',

      // Other rules
      'ava/use-test': 'off',
      'promise/prefer-await-to-then': 'off',
      'promise/param-names': 'off',
      'capitalized-comments': 'off',
      'no-negated-condition': 'off',
      'prefer-destructuring': 'off',
      '@stylistic/function-call-argument-newline': 'off',
      'template-curly-spacing': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    space: 2,
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: [
          'tsconfig.json',
          'renderer/tsconfig.json',
          'test/tsconfig.json',
        ],
      },
    },
    rules: {
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react-hooks/exhaustive-deps': 'off',

      // TypeScript rules
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-exports': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/promise-function-async': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-restricted-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/member-ordering': 'off',

      'no-await-in-loop': 'off',
    },
  },
  {
    files: ['test/**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-assertions': 'off',
      'import-x/no-anonymous-default-export': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
];
