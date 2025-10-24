import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  // Ignore build output folders
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended, // Base JavaScript recommended rules
      tseslint.configs.recommended, // Recommended TypeScript rules
      reactHooks.configs['recommended-latest'], // Enforce React hooks best practices
      reactRefresh.configs.vite, // Prevent issues with React Fast Refresh in Vite
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // Browser global variables
    },
    rules: {
      /* ---------- General JavaScript Rules ---------- */
      'eqeqeq': ['error', 'always'], // Always use === instead of ==
      'no-var': 'error', // Disallow var, enforce let/const
      'prefer-const': 'error', // Suggest const for variables that never change
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn on console.log, allow warn/error
      'no-debugger': 'error', // Prevent accidental debugger statements
      'no-unused-vars': 'off', // Handled by TS below

      /* ---------- TypeScript-specific Rules ---------- */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ], // Warn on unused variables unless prefixed with _
      '@typescript-eslint/no-explicit-any': 'warn', // Discourage using `any`, but only warn
      '@typescript-eslint/explicit-function-return-type': 'off', // Allow inference of return types
      '@typescript-eslint/consistent-type-imports': 'error', // Enforce `import type` for type-only imports
      '@typescript-eslint/no-non-null-assertion': 'warn', // Discourage using `!` unless sure
      '@typescript-eslint/no-floating-promises': 'error', // Prevent forgetting to await promises
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        { 'ts-expect-error': 'allow-with-description' },
      ], // Discourage ts-ignore unless justified with a comment

      /* ---------- React Rules ---------- */
      'react-hooks/rules-of-hooks': 'error', // Enforce rules of hooks
      'react-hooks/exhaustive-deps': 'warn', // Warn if deps are missing in useEffect
      'react-refresh/only-export-components': 'warn', // Warn if non-component is exported in Vite + React

      /* ---------- Code Style ---------- */
      'curly': ['error', 'all'], // Require braces for all control statements
      'object-curly-spacing': ['error', 'always'], // Enforce spaces inside { }
      'array-bracket-spacing': ['error', 'never'], // No spaces inside [ ]
      'semi': ['error', 'always'], // Require semicolons
      'quotes': ['error', 'single', { avoidEscape: true }], // Enforce single quotes
      'indent': ['error', 2, { SwitchCase: 1 }], // 2-space indentation
      'comma-dangle': ['error', 'always-multiline'], // Require trailing commas in multi-line objects/arrays
    },
  },
])
