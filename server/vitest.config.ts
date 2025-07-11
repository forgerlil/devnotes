import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: ['./__tests__/setup-env.ts'],
    globals: true,
    environment: 'node',
    testTimeout: 10000,
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
