// PATH: vite.config.ts
// WHAT: Vite build config for local and GitHub Pages
// WHY:  Ensures correct asset base path and path aliases
// RELEVANT: package.json,README.md,tsconfig.json

import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // For GitHub Pages under https://<user>.github.io/Zoltar/
  // we must set base to "/Zoltar/" so built asset URLs are correct.
  // Locally this does not affect dev server.
  base: '/Zoltar/',
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
