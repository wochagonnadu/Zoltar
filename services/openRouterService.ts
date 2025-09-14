// services/openRouterService.ts
import { OPENROUTER_API_KEY, TEXT_MODEL_ID } from '../config';
// Для работы нужен URL API
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

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
    const response = await fetch(OPENROUTER_API_URL, {
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
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || response.statusText;
      console.error("OpenRouter API error:", errorMsg);
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
