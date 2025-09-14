// PATH: env.d.ts
// WHAT: Type declarations for Vite environment variables
// WHY:  Provide ImportMeta.env typings so TypeScript recognizes Vite vars
// RELEVANT: config.ts, vite.config.ts, tsconfig.json
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Vite's base path for assets and router
  readonly BASE_URL: string;
  readonly VITE_OPENROUTER_API_KEY?: string;
  readonly VITE_OPENROUTER_API_URL?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_TEXT_MODEL_ID?: string;
  readonly MODE?: string;
  // add other VITE_ keys here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
