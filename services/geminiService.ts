
// geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { DomainScore, AnalysisResult, Profile, ChatMessage, GroundingSource } from "../types.ts";

export const analyzeRelationship = async (
  selectedProfiles: Profile[]
): Promise<AnalysisResult> => {
  // Always use process.env.API_KEY directly when initializing the client
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const isGroup = selectedProfiles.length > 2;
  const profilesSummary = selectedProfiles.map(p => ({
    name: p.name,
    role: p.role,
    scores: p.scores.map(s => ({ d: s.domain, p: s.percentage, l: s.level }))
  }));

  const prompt = `
    Analyze the personality dynamics for the following ${selectedProfiles.length} individuals:
    ${JSON.stringify(profilesSummary, null, 2)}

    TASK:
    1. Identify core friction points between specific individuals or the group as a whole.
    2. PROVIDE SCIENTIFIC CONTEXT: Ground your advice in established Big Five psychological theory.
    3. GROUP INSIGHTS: ${isGroup ? 'Analyze the group "vibe" and identify clusters (e.g., who is the emotional outlier).' : 'Analyze the primary relationship dyad.'}
    4. STRATEGIES: Provide actionable protocols for communication.

    VALIDATION:
    Do not invent traits. If someone has 10% Neuroticism, describe them as highly emotionally stable.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      overview: { type: Type.STRING },
      frictionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
      groupDynamics: { type: Type.STRING },
      scientificContext: { type: Type.STRING },
      strategies: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["overview", "frictionPoints", "scientificContext", "strategies"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        // Removed googleSearch because Search Grounding output may not be in JSON format, 
        // which could lead to JSON.parse() failures.
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("The model returned an empty response.");
    }

    const parsed = JSON.parse(text.trim()) as AnalysisResult;
    
    // Extract grounding chunks if any exist
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || "Scientific Reference",
            uri: chunk.web.uri
          });
        }
      });
    }
    
    parsed.groundingSources = sources;
    return parsed;
  } catch (error: any) {
    console.error("Gemini Analysis Error Detail:", error);
    if (error.message?.includes("401") || error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API Key. Please verify the key in your environment settings.");
    }
    throw new Error(error.message || "The AI analysis failed. Please try again later.");
  }
};

export const chatAboutProfiles = async (
  profiles: Profile[],
  history: ChatMessage[],
  userMessage: string
): Promise<string> => {
  // Always use process.env.API_KEY directly when initializing the client
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const context = profiles.map(p => 
    `${p.name} (${p.role}): ${p.scores.map(s => `${s.domain} ${s.percentage}%`).join(', ')}`
  ).join('\n');

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are the Personality Dynamics Lab advisor. You provide concise, empathetic advice based on Big Five data. Reference specific percentages. Current context: ${context}`
      }
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "I was unable to synthesize a response.";
  } catch (error: any) {
    console.error("Chat Error:", error);
    return `Error: ${error.message || "Connection failed."}`;
  }
};
