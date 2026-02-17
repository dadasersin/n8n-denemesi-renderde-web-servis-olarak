
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeDockerError = async (errorText: string, context: string = ''): Promise<AnalysisResult> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze the following Docker build error and provide a detailed explanation, a solution, and the necessary configuration files (Dockerfile, docker-compose.yml, etc.).
    
    User Context:
    The user is likely attempting to deploy n8n (specifically via a project named 'n8n-denemesi').
    
    Error Message: 
    ${errorText}
    
    Context Details:
    ${context}

    CRITICAL ANALYSIS REQUIREMENTS:
    1. The error "Hata: Çözümlenemedi: Dockerfile okunamadı" indicates that the Docker build process is looking for a file named 'Dockerfile' in the root of the repository, but it's missing or named differently.
    2. If the user is trying to deploy n8n from a clone, advise them that the official way to run n8n is usually via an official Docker image (n8nio/n8n) in a docker-compose.yml file, rather than trying to build it from source unless they have custom nodes.
    3. LANGUAGE: Since the error logs are in Turkish, respond with the 'explanation' and 'solution' in TURKISH.
    4. Provide a 'docker-compose.yml' that follows n8n best practices (including persistence volumes and environment variables like N8N_HOST).
    5. Provide a simple 'Dockerfile' if building from source is indeed required for their context.
    
    Response Format (JSON):
    - explanation: (Turkish) Explain precisely why Docker failed (the missing file).
    - solution: (Turkish) Step-by-step fix (e.g., 'Ensure you are in the correct directory', 'Use the official image instead of building', 'Create a Dockerfile').
    - files: Array of generated files with name, language, and content.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          solution: { type: Type.STRING },
          files: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                language: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["name", "language", "content"]
            }
          }
        },
        required: ["explanation", "solution", "files"]
      }
    }
  });

  const result = JSON.parse(response.text || '{}');
  return result as AnalysisResult;
};
