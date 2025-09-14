import path from 'path';
import { defineConfig } from 'vite';

// PATH: vite.config.ts
// WHAT: Vite configuration
// WHY:  Define convenient path aliases for the project
// RELEVANT: config.ts, .env, tsconfig.json

export default defineConfig({
  // Vite automatically loads .env variables with VITE_ prefix.
  // No special configuration is needed here for them to be available
  // on `import.meta.env`. The `define` block was removed as it was
  // redundant and not using the standard Vite mechanism.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
