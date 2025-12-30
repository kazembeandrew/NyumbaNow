
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  async getNeighborhoodAdvice(query: string, city: string = "Lilongwe") {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `I am looking for a house in ${city}, Malawi. ${query}`,
        config: {
          tools: [{ googleMaps: {} }, { googleSearch: {} }],
          systemInstruction: "You are NyumbaAI, a Malawian real estate expert. Help users understand neighborhoods in Lilongwe, Blantyre, Mzuzu, and Zomba. Use Google Maps to find landmarks. Be concise and helpful.",
        },
      });

      return {
        text: response.text,
        links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
          title: chunk.maps?.title || chunk.web?.title,
          uri: chunk.maps?.uri || chunk.web?.uri
        })).filter((l: any) => l.uri) || []
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      return { text: "Zikomo! I'm having trouble connecting right now. Please try again later.", links: [] };
    }
  }
};
