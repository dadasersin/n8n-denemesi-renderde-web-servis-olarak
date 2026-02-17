
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeDockerError = async (errorText: string, context: string = ''): Promise<AnalysisResult> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze the following Docker build error and provide a detailed explanation, a solution, and the necessary configuration files (Dockerfile, docker-compose.yml, etc.).
    
    The user might be deploying n8n or a similar Node.js application based on the context.
    
    Error Message: 
    ${errorText}
    
    Context:
    ${context}

    IMPORTANT INSTRUCTIONS:
    1. If the error is in Turkish (e.g., 'Böyle bir dosya veya dizin yok'), provide the explanation and solution in Turkish, as the user clearly prefers it.
    2. Focus on n8n-specific deployment issues if mentioned.
    3. The error "Dockerfile: no such file or directory" usually means the build context is wrong or the file is missing from the repository. Check if the user is trying to build a repo that expects a Dockerfile but it's not in the expected root path.
    
    Please provide the response in a structured JSON format with the following keys:
    - explanation: A clear human-readable explanation of why this error occurred.
    - solution: Step-by-step instructions to fix it.
    - files: An array of objects, each with 'name', 'language', and 'content'.
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
