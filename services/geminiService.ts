// geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { DomainScore, AnalysisResult } from "../types.ts";

export const analyzeRelationship = async (
  profileA: { name: string; scores: DomainScore[]; role: string },
  profileB: { name: string; scores: DomainScore[]; role: string }
): Promise<AnalysisResult> => {
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert Behavioral Neuroscientist and Clinical Psychologist specializing in the Big Five Aspect Scale (IPIP-NEO-PI-R).
    
    Analyze the dynamics between these two individuals based on their psychometric profiles.
    
    **Person A** (Role: ${profileA.role}, Name: ${profileA.name}):
    ${JSON.stringify(profileA.scores.map(s => ({ domain: s.domain, score: s.score, max: s.maxScore, level: s.level })))}
    
    **Person B** (Role: ${profileB.role}, Name: ${profileB.name}):
    ${JSON.stringify(profileB.scores.map(s => ({ domain: s.domain, score: s.score, max: s.maxScore, level: s.level })))}

    **Task:**
    1. Identify the *single most critical* friction point caused by divergent traits (e.g., High Orderliness vs Low Orderliness, or High Neuroticism vs High Extraversion).
    2. Explain the **Neuroscience/Psychological Mechanism**: Why do their brains process the world differently in this specific area? (e.g., talk about amygdala sensitivity, prefrontal cortex inhibition, dopamine reward circuits).
    3. Provide **Actionable Strategies**: Concrete "If/Then" behavioral adjustments for both parties.

    **Output Requirements:**
    Return ONLY valid JSON matching the schema.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      overview: {
        type: Type.STRING,
        description: "A professional, concise executive summary of the relationship dynamic.",
      },
      frictionPoints: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 specific scenarios where their traits will clash (e.g., 'Planning a vacation', 'Handling a crisis').",
      },
      scientificContext: {
        type: Type.STRING,
        description: "The 'Mechanism'. Explain the neurological or psychological divergence. Use scientific terms (e.g., 'cortical arousal', 'threat detection system').",
      },
      strategies: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 highly specific, actionable behavioral protocols. Format: 'When [Event] happens, [Person] should [Action] because [Reason]'.",
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

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to generate analysis.");
  }
};