// Type declarations for Vite import.meta.env
// Extend with app-specific VITE_ variables here.
interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY?: string;
  readonly VITE_OPENROUTER_API_URL?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_TEXT_MODEL_ID?: string;
  // add more env vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
