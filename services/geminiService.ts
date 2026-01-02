// geminiService.ts (updated to latest SDK)
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DomainScore, AnalysisResult } from "../types.ts";

export const analyzeRelationship = async (parentScores: DomainScore[], childScores: DomainScore[]): Promise<AnalysisResult> => {
  // Note: In browser/client-side, never hardcode API keys!
  // Use a backend proxy in production.
  const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || process.env.API_KEY || "YOUR_API_KEY_HERE";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // or gemini-2.0 when available

  const prompt = `
    Analyze relationship dynamics:
    Parent: ${JSON.stringify(parentScores)}
    Simulated Child: ${JSON.stringify(childScores)}
    
    Identify friction points based on trait differences (OCEAN model).
    Respond ONLY with valid JSON matching this schema:
    {
      "overview": string,
      "frictionPoints": string[],
      "scientificContext": string,
      "strategies": string[]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return JSON.parse(text) as AnalysisResult;
};