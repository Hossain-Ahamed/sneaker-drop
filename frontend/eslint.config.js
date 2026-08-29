import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // feature types are declared as a namespace per .claude/agent.md, mirroring the backend
      '@typescript-eslint/no-namespace': 'off',
    },
  },
  {
    // shadcn owns these files and exports variants alongside components
    files: ['src/components/ui/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
