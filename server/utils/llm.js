// Simple Gemini wrapper using the @google/genai SDK
require('dotenv').config();
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

let GoogleGenAI = null;
let ai = null;
try {
  GoogleGenAI = require('@google/genai').GoogleGenAI;
  if (GEMINI_KEY) ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
} catch (e) {
  // SDK not installed or failed to load; we'll surface a clear error when used
  GoogleGenAI = null;
  ai = null;
}

async function rewriteArticle(original, references) {
  const refsSummary = (references || []).map((r, i) => `Reference ${i+1}: Title: ${r.title}\nURL: ${r.url}\nSnippet: ${r.content?.slice(0,400).replace(/\n/g,' ')}...`).join('\n\n');

  const prompt = `Original Title:\n${original.title}\n\nOriginal Content:\n${(original.originalContent||original.content||'').slice(0,3000)}\n\nReferences:\n${refsSummary}\n\nInstructions:\nRewrite the original article to improve clarity, structure, and formatting. Make it similar in style and coverage to the reference articles. Preserve factual claims from the original. Output only JSON with keys: title, content. The content should include a final 'References' section that lists each reference with title and url.`;

  if (!ai) {
    const msg = !GoogleGenAI ? 'Gemini SDK (@google/genai) not installed' : 'GEMINI_API_KEY not configured';
    console.error('LLM unavailable:', msg);
    throw new Error(msg);
  }

  try {
    const resp = await ai.models.generateContent({ model: GEMINI_MODEL, contents: prompt });
    // SDK usually returns { text } or similar
    const text = resp?.text || resp?.output || (typeof resp === 'string' ? resp : JSON.stringify(resp));
    try {
      const jsonStart = text.indexOf('{');
      const jsonText = jsonStart >= 0 ? text.slice(jsonStart) : text;
      const parsed = JSON.parse(jsonText);
      return parsed;
    } catch (e) {
      return { title: original.title, content: text };
    }
  } catch (err) {
    console.error('Gemini SDK error:', err?.response?.data || err.message || err);
    throw err;
  }
}

module.exports = { rewriteArticle };
