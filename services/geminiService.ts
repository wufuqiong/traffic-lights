import { GoogleGenAI } from "@google/genai";

export const generateSafetyTip = async (): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Remember to look both ways before crossing!"; // Fallback if no key
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using flash for speed and simplicity
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a single, short, fun, and easy-to-understand traffic safety tip or a car-related joke for a 5-year-old child waiting at a red light. Keep it under 20 words. Emoji friendly.",
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster simple response
      }
    });

    return response.text?.trim() || "Stay safe and buckle up!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Red means stop! Wait for the green light.";
  }
};