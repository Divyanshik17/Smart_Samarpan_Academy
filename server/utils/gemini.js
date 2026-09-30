import fetch from "node-fetch";

// Reliable active models in order of priority (tested with Google Generative Language API)
const GEMINI_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest"
];

export const callGeminiAPI = async (payload, apiKey) => {
  if (!apiKey) {
    return {
      success: false,
      status: 500,
      message: "AI service not configured. Please set GEMINI_API_KEY on the server."
    };
  }

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, result, modelUsed: model };
      }

      const errorData = await response.json().catch(() => null);
      console.warn(
        `Gemini model [${model}] returned status ${response.status}:`,
        errorData?.error?.message || errorData
      );

      lastError = { status: response.status, data: errorData };

      // If rate limited (429), temporarily unavailable (503), or deprecated (404),
      // seamlessly try the next model in the fallback pool
      if (response.status === 429 || response.status === 503 || response.status === 404) {
        continue;
      } else {
        break;
      }
    } catch (networkError) {
      console.warn(`Network error trying Gemini model [${model}]:`, networkError.message);
      lastError = { status: 500, data: networkError.message };
    }
  }

  const isRateLimit = lastError?.status === 429;
  return {
    success: false,
    status: isRateLimit ? 429 : (lastError?.status || 500),
    message: isRateLimit
      ? "AI rate limit exceeded. Please wait a few moments and try again."
      : "Failed to generate response from AI models.",
    details: lastError?.data
  };
};
