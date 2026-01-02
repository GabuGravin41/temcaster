// geminiService.ts
import { GoogleGenAI, Type } from "https://esm.sh/@google/genai@0.1.1";
import { DomainScore, AnalysisResult } from "../types.ts";

export const analyzeRelationship = async (
  profileA: { name: string; scores: DomainScore[] },
  profileB: { name: string; scores: DomainScore[] }
): Promise<AnalysisResult> => {
  
  // Note: In browser/client-side, never hardcode API keys in production!
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }
  
  // Initialize with the new SDK signature
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the relationship dynamics based on the Big Five (OCEAN) personality traits.
    
    Person A (${profileA.name}): ${JSON.stringify(profileA.scores.map(s => ({ domain: s.domain, level: s.level, percent: s.percentage })))}
    Person B (${profileB.name}): ${JSON.stringify(profileB.scores.map(s => ({ domain: s.domain, level: s.level, percent: s.percentage })))}
    
    Identify specific friction points where traits clash (e.g., High Order vs Low Order), and provide scientific context and strategies.
  `;

  // Define strict output schema
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      overview: {
        type: Type.STRING,
        description: "A high-level executive summary of the dynamic between these two personalities.",
      },
      frictionPoints: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 3-5 specific areas where their traits might cause conflict.",
      },
      scientificContext: {
        type: Type.STRING,
        description: "Evolutionary or psychological explanation of why these traits interact this way.",
      },
      strategies: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Actionable, concrete advice for managing this specific dynamic.",
      },
    },
    required: ["overview", "frictionPoints", "scientificContext", "strategies"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    // With the new SDK and schema, we can trust the text is valid JSON
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to generate analysis.");
  }
};