
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeDockerError = async (errorText: string, context: string = ''): Promise<AnalysisResult> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze the following Docker build error and provide a detailed explanation, a solution, and the necessary configuration files (Dockerfile, docker-compose.yml, etc.).
    
    User Context:
    The user is deploying n8n (project: 'n8n-denemesi') and likely using a cloud platform like Render.com.
    
    Error Message: 
    ${errorText}
    
    Context Details:
    ${context}

    CRITICAL ANALYSIS REQUIREMENTS:
    1. The error "Hata: Çözümlenemedi: Dockerfile okunamadı" explicitly means the platform (Render, etc.) is trying to find a "Dockerfile" in the root of the repository to build the container, but it is missing.
    2. Explain in TURKISH why this happens on "Render" specifically (Render needs a Dockerfile for 'Web Service' types if it's a Docker build).
    3. LANGUAGE: Respond with the 'explanation' and 'solution' in TURKISH.
    4. Provide a standard, robust 'Dockerfile' for n8n that uses the official image.
    5. Provide a 'render.yaml' if applicable or a standard 'docker-compose.yml' for reference.
    
    Response Format (JSON):
    - explanation: (Turkish) Explain precisely that the build failed because the repo lacks a Dockerfile, causing Render to fail the build process.
    - solution: (Turkish) Step-by-step fix: Create the Dockerfile, add it to git, push to main, and Render will restart the build.
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
