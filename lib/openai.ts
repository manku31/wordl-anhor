import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

export type WordDefinition = {
  meaning: string;
  example: string;
};

const SYSTEM_PROMPT =
  'You are a vocabulary assistant. For the given word (and optional hint), return a JSON object with exactly two keys:\n- "meaning": one plain, very simple sentence that explains what the word means (no jargon, no dictionary-style formatting)\n- "example": one short, natural sentence that uses the word in context\nRespond with valid JSON only.';

function userPrompt(word: string, details?: string | null) {
  return details ? `Word: "${word}"\nHint: ${details}` : `Word: "${word}"`;
}

function parseDefinition(raw: string): WordDefinition | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const meaning =
      typeof parsed.meaning === "string" ? parsed.meaning.trim() : null;
    const example =
      typeof parsed.example === "string" ? parsed.example.trim() : null;
    if (!meaning || !example) return null;
    return { meaning, example };
  } catch {
    return null;
  }
}

// ── Provider 1: OpenAI ────────────────────────────────────────────────────────
async function fromOpenAI(
  word: string,
  details?: string | null,
): Promise<WordDefinition | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(word, details) },
      ],
    });
    const raw = response.choices[0]?.message?.content;
    return raw ? parseDefinition(raw) : null;
  } catch (e) {
    console.warn("[word-anchor] OpenAI failed:", (e as Error).message);
    return null;
  }
}

// ── Provider 2: Gemini ────────────────────────────────────────────────────────
async function fromGemini(
  word: string,
  details?: string | null,
): Promise<WordDefinition | null> {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `${SYSTEM_PROMPT}\n\n${userPrompt(word, details)}`;
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    const raw = response.text;
    return raw ? parseDefinition(raw) : null;
  } catch (e) {
    console.warn("[word-anchor] Gemini failed:", (e as Error).message);
    return null;
  }
}

// ── Provider 3: DeepSeek (OpenAI-compatible) ──────────────────────────────────
async function fromDeepSeek(
  word: string,
  details?: string | null,
): Promise<WordDefinition | null> {
  if (!process.env.DEEPSEEK_API_KEY) return null;
  try {
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(word, details) },
      ],
    });
    const raw = response.choices[0]?.message?.content;
    return raw ? parseDefinition(raw) : null;
  } catch (e) {
    console.warn("[word-anchor] DeepSeek failed:", (e as Error).message);
    return null;
  }
}

// ── Public entry point — tries providers in order, returns first success ──────
export async function getWordDefinition(
  word: string,
  details?: string | null,
): Promise<WordDefinition | null> {
  return (
    (await fromOpenAI(word, details)) ??
    (await fromGemini(word, details)) ??
    (await fromDeepSeek(word, details)) ??
    null
  );
}
