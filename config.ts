// PATH: config.ts
// WHAT: Exposes runtime configuration (OpenRouter keys and URLs)
// WHY:  Central place to read Vite env vars and provide defaults to the app
// RELEVANT: services/openRouterService.ts, App.tsx, .env

// Prefer Vite environment variables (import.meta.env). These are injected at build/dev
// time. Keep secrets out of source control; use a server-side proxy for production.

// Helper: remove surrounding quotes (dotenv sometimes leaves them) and trim
const sanitize = (v?: string) => (v ? v.replace(/^\s*"|"\s*$/g, '').trim() : '');

export const OPENROUTER_API_KEY: string = sanitize(import.meta.env.VITE_OPENROUTER_API_KEY as string);
export const OPENROUTER_API_URL: string = sanitize(import.meta.env.VITE_OPENROUTER_API_URL as string) || 'https://openrouter.ai/api/v1';
export const APP_TITLE: string = sanitize(import.meta.env.VITE_APP_TITLE as string) || 'Zoltar Speaks';
export const TEXT_MODEL_ID: string = sanitize(import.meta.env.VITE_TEXT_MODEL_ID as string) || 'deepseek/deepseek-chat-v3-0324:free';

// If you plan to use OpenRouter for image generation in the future
// export const IMAGE_MODEL_ID: string = (import.meta.env.VITE_IMAGE_MODEL_ID as string) ?? "stability-ai/sdxl:free";
