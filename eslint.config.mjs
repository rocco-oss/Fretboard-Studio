const globals = Object.fromEntries([
  'KeyboardEvent', 'window', 'document', 'HTMLElement', 'HTMLInputElement', 'HTMLSelectElement',
  'HTMLDialogElement', 'HTMLFormElement', 'HTMLButtonElement', 'HTMLDetailsElement', 'Element', 'Node', 'AudioContext',
  'setTimeout', 'clearTimeout', 'console', 'process', 'URL', 'structuredClone',
  'requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'navigator',
  'Map', 'Set', 'AbortController', 'MutationObserver', 'Event', 'localStorage',
  'Float32Array', 'Uint8Array', 'HTMLOptionElement', 'TextEncoder', 'HTMLTextAreaElement', 'ResizeObserver', 'innerWidth', 'innerHeight', 'CustomEvent', 'getComputedStyle', 'matchMedia', 'Blob'
].map(name => [name, 'readonly']));

export default [
  { ignores: ['dist/**', 'node_modules/**', 'test-results/**', 'playwright-report/**', 'src/types/**'] },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals },
    rules: {
      'no-undef': 'error', 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-duplicate-imports': 'error', 'no-unreachable': 'error',
      'no-constant-condition': 'error', 'no-dupe-keys': 'error',
      'no-fallthrough': 'error', 'no-empty': ['error', { allowEmptyCatch: true }],
      'eqeqeq': 'error', 'prefer-const': 'error', 'no-var': 'error'
    }
  }
];
