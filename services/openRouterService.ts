// services/openRouterService.ts
// PATH: services/openRouterService.ts
// WHAT: Клиент для OpenRouter chat completions API
// WHY:  Получает предсказание от модели через OpenRouter
// RELEVANT: config.ts, App.tsx, .env
import { OPENROUTER_API_KEY, TEXT_MODEL_ID, OPENROUTER_API_URL, OPENROUTER_PROXY_URL } from '../config';

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
  const useProxy = Boolean(OPENROUTER_PROXY_URL);
  const endpoint = useProxy ? OPENROUTER_PROXY_URL : OPENROUTER_CHAT_COMPLETIONS;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (!useProxy) {
    headers['Authorization'] = `Bearer ${OPENROUTER_API_KEY}`;
    headers['X-Title'] = (typeof document !== 'undefined' && document.title) || 'Zoltar';
    // Browser automatically sets Referer; for server/edge proxies set HTTP-Referer.
    if (typeof window !== 'undefined') {
      headers['HTTP-Referer'] = window.location.origin;
    }
  }
    // Add a small changing signal to avoid provider-side caching and encourage variety
    const nonce = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const userPrompt = `Please reveal a concise, positive fortune. Make it different from previous ones. Language: ${language}. Session: ${nonce}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: TEXT_MODEL_ID,
        messages: [
          { role: "system", content: systemPromptContent + (language ? `\nLanguage: ${language}` : "") },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 128,
        temperature: 1.0,
        presence_penalty: 0.6,
        frequency_penalty: 0.2
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
    // Try multiple shapes some providers use via OpenRouter
    let fortune: any = data.choices?.[0]?.message?.content;
    if (!fortune) {
      const alt = data.choices?.[0]?.content; // some return string or array
      if (Array.isArray(alt)) {
        fortune = alt.map((p: any) => p?.text ?? p).join('').trim();
      } else if (typeof alt === 'string') {
        fortune = alt;
      }
    }
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
