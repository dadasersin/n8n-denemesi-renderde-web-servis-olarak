
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeN8nLogs = async (logs: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following Render logs for an n8n deployment. The user is experiencing "Lost connection to the server" or deployment crashes. 
    Look for:
    1. Out of Memory (OOM) kills.
    2. SQLite database locking issues (database is locked).
    3. WebSocket or SSE connection timeouts.
    4. Port binding errors.
    5. Disk space issues.
    6. Missing package.json (ENOENT) errors during startup (often caused by incorrect Start Command like 'npm start' instead of 'n8n start' or leaving it blank).

    Logs:
    ${logs}
    `,
    config: {
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

  try {
    return JSON.parse(response.text || '{}') as AnalysisResult;
  } catch (e) {
    throw new Error("Failed to parse analysis result from Gemini");
  }
};
