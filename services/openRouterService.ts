// services/openRouterService.ts
// PATH: services/openRouterService.ts
// WHAT: Клиент для OpenRouter chat completions API
// WHY:  Получает предсказание от модели через OpenRouter
// RELEVANT: config.ts, App.tsx, .env
import { OPENROUTER_API_KEY, TEXT_MODEL_ID, OPENROUTER_API_URL } from '../config';

// Полный endpoint собираем из базового URL в конфиге
const apiUrl = OPENROUTER_API_URL.endsWith('/') ? OPENROUTER_API_URL.slice(0, -1) : OPENROUTER_API_URL;
const OPENROUTER_CHAT_COMPLETIONS = `${apiUrl}/chat/completions`;

export const getFortuneFromOpenRouter = async (
  systemPromptContent: string,
  language: string
): Promise<string> => {
  if (!OPENROUTER_API_KEY) {
    console.error("getFortuneFromOpenRouter: OpenRouter API key is not configured.");
    return "errors.api.keyMissing";
  }
  if (!TEXT_MODEL_ID) {
    console.error("getFortuneFromOpenRouter: OpenRouter text model ID is not configured.");
    return "errors.api.modelMissing";
  }
  if (!systemPromptContent) {
    console.error("getFortuneFromOpenRouter: systemPromptContent is missing.");
    return "errors.api.promptMissing";
  }
  try {
    // Debug: do not print the full key. Show a small masked sample so we can
    // verify that the client has the key injected from Vite env. Use
    // import.meta.env.MODE (provided by Vite) to restrict logs to non-prod.
    const isDev = (import.meta.env && (import.meta.env.MODE !== 'production')) as boolean;
    if (isDev) {
      const apiKeySample = OPENROUTER_API_KEY
        ? `${OPENROUTER_API_KEY.slice(0, 8)}...${OPENROUTER_API_KEY.slice(-4)}`
        : null;
      // eslint-disable-next-line no-console
      console.debug('OpenRouter config - apiKeySample:', apiKeySample, 'apiKeyPresent:', Boolean(OPENROUTER_API_KEY), 'model:', TEXT_MODEL_ID, 'endpoint:', OPENROUTER_CHAT_COMPLETIONS);
    }
  const response = await fetch(OPENROUTER_CHAT_COMPLETIONS, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: TEXT_MODEL_ID,
        messages: [
          {
            role: "system",
            content: systemPromptContent + (language ? `\nLanguage: ${language}` : "")
          }
        ],
        max_tokens: 128,
        temperature: 0.8
      })
    });
    // Debug: check response status and body for clearer diagnosis of 401
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      let parsed = {} as any;
      try { parsed = text ? JSON.parse(text) : {}; } catch(e) { parsed = { raw: text }; }
      // eslint-disable-next-line no-console
      console.error('OpenRouter API error status:', response.status, 'body:', parsed);
      return "errors.api.fetchError";
    }
    const data = await response.json();
    let fortune = data.choices?.[0]?.message?.content;
    if (!fortune) {
      console.error("OpenRouter API: ответ не содержит предсказания", data);
      return "errors.api.noFortune";
    }
    // Удаляем префикс "/English Fortune:" если он есть
    fortune = fortune.replace(/^\/?English Fortune:\s*/i, "");
    return fortune.trim();
  } catch (error) {
    console.error("Error in getFortuneFromOpenRouter:", error);
    if (error instanceof Error && error.message.startsWith("errors.api.")) {
      return error.message;
    }
    return "errors.api.unexpectedError";
  }
};
