// geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { DomainScore, AnalysisResult, Profile, ChatMessage, GroundingSource } from "../types.ts";

export const analyzeRelationship = async (
  selectedProfiles: Profile[]
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing. Please ensure it is configured in your environment.");
  
  // Re-instantiate to ensure fresh API key context
  const ai = new GoogleGenAI({ apiKey });

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
    2. PROVIDE SCIENTIFIC CONTEXT: Ground your advice in established Big Five psychological theory. Use footnotes or brief citations where appropriate.
    3. GROUP INSIGHTS: ${isGroup ? 'Analyze the group "vibe" and identify clusters (e.g., who is the emotional outlier, who is the stabilizer).' : 'Analyze the primary relationship dyad.'}
    4. STRATEGIES: Provide actionable If/Then protocols for better communication.

    CRITICAL VALIDATION:
    Double-check the data. Do not invent traits. If someone has 10% Neuroticism, describe them as highly emotionally stable.

    GROUNDING:
    Search for a credible psychological reference for one specific interaction pattern found in this data.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      overview: { type: Type.STRING },
      frictionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
      groupDynamics: { type: Type.STRING, description: "Specific insights for 3+ people" },
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
        tools: [{ googleSearch: {} }],
      },
    });

    const parsed = JSON.parse(response.text!) as AnalysisResult;
    
    // Extract grounding chunks as scientific citations
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
    console.error("Gemini Analysis Error:", error);
    throw new Error(error.message || "The AI analysis failed. Please check your API key.");
  }
};

export const chatAboutProfiles = async (
  profiles: Profile[],
  history: ChatMessage[],
  userMessage: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");
  
  const ai = new GoogleGenAI({ apiKey });
  
  const context = profiles.map(p => 
    `${p.name} (${p.role}): ${p.scores.map(s => `${s.domain} ${s.percentage}%`).join(', ')}`
  ).join('\n');

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the Personality Dynamics Lab advisor. You provide concise, empathetic advice based on Big Five data.
      Current Comparison:
      ${context}
      
      Rules:
      1. Reference specific percentages to stay grounded.
      2. If asked about a clash, explain the distance (divergence) between scores.
      3. Be scientifically accurate but warm.`
    }
  });

  const result = await chat.sendMessage({ message: userMessage });
  return result.text || "I'm having trouble processing that request.";
};