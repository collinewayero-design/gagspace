import { GoogleGenAI } from "@google/genai";

// Safe environment variable retrieval
const getEnv = (key: string, viteKey: string): string => {
  let val = '';
  try {
    // Check import.meta.env (Vite standard)
    // @ts-ignore
    if (import.meta && import.meta.env) {
      // @ts-ignore
      val = import.meta.env[viteKey] || '';
    }
    
    // Fallback to process.env if needed
    if (!val && typeof process !== 'undefined' && process.env) {
      val = process.env[key] || process.env[viteKey] || '';
    }
  } catch (e) {
    console.warn("Error reading environment variables", e);
  }
  return val;
};

const apiKey = getEnv('API_KEY', 'VITE_GEMINI_API_KEY');

// Debug log to help user verify .env is working
if (!apiKey) {
  console.warn("GigSpace: VITE_GEMINI_API_KEY is missing. AI features will be disabled. Check your .env file.");
} else {
  console.log("GigSpace: AI Service Initialized successfully.");
}

// Initialize only if key exists to avoid immediate errors
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Enhances a raw project description using Gemini to sound more professional and compelling.
 */
export const enhanceProjectDescription = async (rawDescription: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing. AI features disabled.");
    return rawDescription;
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      You are an expert copywriter for a high-end design and tech portfolio.
      Rewrite the following project description to be professional, concise, and impactful.
      Focus on value, clarity, and a sophisticated tone. Keep it under 50 words.

      Raw Description: "${rawDescription}"
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text?.trim() || rawDescription;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to original text if AI fails
    return rawDescription;
  }
};

/**
 * Generates suggested tags based on a title and description.
 */
export const generateProjectTags = async (title: string, description: string): Promise<string[]> => {
    if (!ai) return [];
    
    try {
        const model = 'gemini-3-flash-preview';
        const prompt = `
          Generate 3-5 short, relevant technical or design tags for a project with 
          Title: "${title}" and Description: "${description}".
          Return ONLY a comma-separated list of tags. No other text.
          Example output: React, UX Design, API
        `;
    
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
        });
    
        const text = response.text?.trim() || "";
        return text.split(',').map(tag => tag.trim()).filter(t => t.length > 0);
      } catch (error) {
        console.error("Gemini API Error:", error);
        return [];
      }
}