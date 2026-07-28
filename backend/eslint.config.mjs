import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';

export default [{
  ignores: ['dist/', 'coverage/'],
  files: ['**/*.ts'],
  languageOptions: { parser, parserOptions: { ecmaVersion: 2022, sourceType: 'module' } },
  plugins: { '@typescript-eslint': plugin },
  rules: {
    ...plugin.configs.recommended.rules,
    '@typescript-eslint/no-explicit-any': 'error'
  }
}];
