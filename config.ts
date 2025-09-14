// PATH: /config.ts
// WHAT: Application configuration.
// WHY: To centralize configuration variables.
// RELEVANT: services/openRouterService.ts

// Use Vite's import.meta.env to access environment variables
// IMPORTANT: do NOT hardcode secrets in source files. Keep them in a local
// .env file and add that file to .gitignore. If a secret was committed,
// rotate it and remove it from the repo history (see README / instructions).

export const OPENROUTER_API_KEY: string | undefined = import.meta.env.VITE_OPENROUTER_API_KEY;

// OpenRouter API base URL; keep default but allow override from env
export const OPENROUTER_API_URL: string = import.meta.env.VITE_OPENROUTER_API_URL || "https://openrouter.ai/api/v1";

export const APP_TITLE: string = import.meta.env.VITE_APP_TITLE || "Zoltar Speaks";
export const TEXT_MODEL_ID: string = import.meta.env.VITE_TEXT_MODEL_ID || "deepseek/deepseek-chat-v3-0324:free";
