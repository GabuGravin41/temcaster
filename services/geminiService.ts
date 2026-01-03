// geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { DomainScore, AnalysisResult, Profile, ChatMessage } from "../types.ts";

export const analyzeRelationship = async (
  profileA: { name: string; scores: DomainScore[]; role: string },
  profileB: { name: string; scores: DomainScore[]; role: string }
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("MISSING_API_KEY");
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the personality dynamics between Person A (${profileA.name}, ${profileA.role}) and Person B (${profileB.name}, ${profileB.role}).
    
    A Scores: ${JSON.stringify(profileA.scores.map(s => ({ d: s.domain, p: s.percentage })))}
    B Scores: ${JSON.stringify(profileB.scores.map(s => ({ d: s.domain, p: s.percentage })))}

    Identify the most critical friction point, explain the psychological mechanism, and provide if/then protocols.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      overview: { type: Type.STRING },
      frictionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
      scientificContext: { type: Type.STRING },
      strategies: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["overview", "frictionPoints", "scientificContext", "strategies"],
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", 
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  return JSON.parse(response.text!) as AnalysisResult;
};

export const chatAboutProfiles = async (
  profiles: Profile[],
  history: ChatMessage[],
  userMessage: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("MISSING_API_KEY");
  
  const ai = new GoogleGenAI({ apiKey });
  
  const context = profiles.map(p => 
    `${p.name} (${p.role}): ${p.scores.map(s => `${s.domain} ${s.percentage}%`).join(', ')}`
  ).join('\n');

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the Personality Dynamics Lab advisor. Use the Big Five data provided to help users understand relationship friction and compatibility. 
      Profiles in current comparison:
      ${context}
      
      Provide concise, empathetic, and scientifically grounded advice. Focus on the data gaps between these people.`
    }
  });

  const result = await chat.sendMessage({ message: userMessage });
  return result.text || "I'm having trouble analyzing that. Could you rephrase?";
};