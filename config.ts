// config.ts

// WARNING: In a real-world application, this file (or the keys within)
// should be managed securely, for example, through environment variables
// and NOT committed to version control if it contains sensitive keys.
// Consider adding this file to .gitignore.

export const OPENROUTER_API_KEY: string = "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";
export const OPENROUTER_API_URL: string = "https://openrouter.ai/api/v1";
// export const OPENROUTER_SITE_URL: string = "https://your-site-url.com"; // Replace with your actual site URL
export const APP_TITLE: string = "Zoltar Speaks"; // Or your app's name
export const TEXT_MODEL_ID: string = "deepseek/deepseek-chat-v3-0324:free"; // Using gemma-3b-it as gemma-3n-e4b-it is not listed on OpenRouter docs, adjust if needed

// If you plan to use OpenRouter for image generation in the future (though not in this request)
// export const IMAGE_MODEL_ID: string = "stability-ai/sdxl:free"; // Example image model
