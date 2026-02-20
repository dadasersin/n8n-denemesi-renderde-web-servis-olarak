import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeN8nLogs = async (logs: string): Promise<AnalysisResult> => {
  const apiKey = (window as any).process?.env?.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set it in the environment variables.");
  }

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash',
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diagnosis: { type: Type.STRING, description: "A summary of the most likely issue found in logs." },
          probableCauses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of possible reasons for the crash."
          },
          suggestedFixes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                code: { type: Type.STRING, description: "Code snippet or environment variable example." }
              },
              required: ["title", "description"]
            }
          }
        },
        required: ["diagnosis", "probableCauses", "suggestedFixes"]
      }
    }
  });

  const prompt = `Analyze the following Render logs for an n8n deployment. The user is experiencing "Lost connection to the server" or deployment crashes.
    Look for:
    1. Out of Memory (OOM) kills.
    2. SQLite database locking issues (database is locked).
    3. WebSocket or SSE connection timeouts.
    4. Port binding errors.
    5. Disk space issues.
    6. Missing package.json (ENOENT) errors during startup (often caused by incorrect Start Command like 'npm start' instead of 'n8n start' or leaving it blank).

    Logs:
    ${logs}
    `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  try {
    return JSON.parse(responseText) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse analysis result from Gemini:", responseText);
    throw new Error("Failed to parse analysis result from Gemini");
  }
};
