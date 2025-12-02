import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a creative bio and a suggested role for a user based on their name.
 * @param firstName User's first name
 * @param lastName User's last name
 * @returns Object containing bio and role
 */
export const generateUserProfile = async (firstName: string, lastName: string): Promise<{ bio: string; role: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Génère un profil fictif, professionnel et créatif pour une personne nommée ${firstName} ${lastName}. Je veux un titre de poste moderne (ex: "Architecte Cloud", "Botaniste Urbain") et une courte biographie (max 20 mots) amusante ou inspirante.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: {
              type: Type.STRING,
              description: "Un titre de poste moderne et créatif",
            },
            bio: {
              type: Type.STRING,
              description: "Une biographie courte et percutante (max 20 mots)",
            },
          },
          required: ["role", "bio"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Aucune réponse générée par l'IA.");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Erreur Gemini:", error);
    // Fallback in case of error
    return {
      role: "Nouvel Utilisateur",
      bio: "Passionné par la technologie et l'innovation."
    };
  }
};
