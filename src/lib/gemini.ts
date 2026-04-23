import { GoogleGenAI } from '@google/genai';

const GEMINI_KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3,
  process.env.GEMINI_KEY_4,
  process.env.GEMINI_KEY_5,
  process.env.GEMINI_KEY_6,
].filter(Boolean) as string[];

let currentKeyIndex = 0;

function getNextKey(): string {
  if (GEMINI_KEYS.length === 0) throw new Error('No Gemini API keys configured');
  const key = GEMINI_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
  return key;
}

async function callGemini(prompt: string, retries = GEMINI_KEYS.length): Promise<string> {
  for (let i = 0; i < retries; i++) {
    const key = getNextKey();
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      return response.text || '';
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      if (err.status === 429 || err.message?.includes('quota')) {
        console.log(`Key ${currentKeyIndex} rate limited, rotating...`);
        continue;
      }
      throw error;
    }
  }
  throw new Error('All Gemini API keys exhausted');
}

function parseRecipeJSON(text: string) {
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];
  return JSON.parse(cleaned);
}

export async function generateRecipe(ingredients: string[]): Promise<object> {
  const prompt = `You are an Indian cooking expert. Generate a detailed Indian recipe using these ingredients: ${ingredients.join(', ')}.
Return ONLY a JSON object (no markdown) with: title, description, ingredients (array of {name, quantity, unit, isOptional}), instructions (array of strings), tags (array), cookingTime (number in minutes), prepTime (number), servings (number), difficulty ("easy"/"medium"/"hard"), cuisine (string).`;
  const text = await callGemini(prompt);
  return parseRecipeJSON(text);
}

export async function surpriseRecipe(): Promise<object> {
  const prompt = `You are an Indian cooking expert. Suggest a random, creative Indian recipe.
Return ONLY a JSON object (no markdown) with: title, description, ingredients (array of {name, quantity, unit, isOptional}), instructions (array of strings), tags (array), cookingTime (number in minutes), prepTime (number), servings (number), difficulty ("easy"/"medium"/"hard"), cuisine (string).`;
  const text = await callGemini(prompt);
  return parseRecipeJSON(text);
}

export function isGeminiConfigured(): boolean {
  return GEMINI_KEYS.length > 0;
}
