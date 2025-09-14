// PATH: /config.ts
// WHAT: Application configuration.
// WHY: To centralize configuration variables.
// RELEVANT: services/openRouterService.ts

// Use Vite's import.meta.env to access environment variables
export const OPENROUTER_API_KEY: string = import.meta.env.VITE_OPENROUTER_API_KEY;

export const APP_TITLE: string = import.meta.env.VITE_APP_TITLE || "Zoltar Speaks";
export const TEXT_MODEL_ID: string = import.meta.env.VITE_TEXT_MODEL_ID || "deepseek/deepseek-chat-v3-0324:free";
