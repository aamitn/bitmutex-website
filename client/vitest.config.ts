import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, './vitest.setup.ts')],
    globals: true,

    coverage: {
      provider: "v8", // or "istanbul"
      reporter: ["text", "json", "html", "json-summary", "lcov"], // Formats for terminal logs and visual dashboards
      reportsDirectory: "./coverage", // Target directory where reports will output
    },

    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // ✅ FIX: Tell Vitest to stay out of the E2E folder and ignore system defaults
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**', //  Excludes your Playwright tests
    ],
  },
});