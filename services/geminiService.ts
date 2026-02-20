import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeN8nLogs = async (logs: string): Promise<AnalysisResult> => {
  // Try to get API Key from various sources
  const apiKey = (window as any).process?.env?.API_KEY ||
                 (window as any).process?.env?.GEMINI_API_KEY ||
                 (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    throw new Error("Gemini API Anahtarı bulunamadı. Lütfen Render ortam değişkenlerinde GEMINI_API_KEY tanımlayın.");
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

  const prompt = `Aşağıdaki Render loglarını analiz et. Kullanıcı n8n servisinde "Sunucuyla bağlantı kesildi" veya çökme sorunları yaşıyor.
    Logları incelerken şunlara odaklan:
    1. Bellek yetersizliği (OOM/SIGKILL).
    2. SQLite veritabanı kilitlenmeleri (database is locked).
    3. Port bağlama hataları (EADDRINUSE veya yanlış port).
    4. Render ücretsiz plan kısıtlamaları.

    LÜTFEN TÜRKÇE YANIT VER.

    Loglar:
    ${logs}
    `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText) as AnalysisResult;
  } catch (e: any) {
    console.error("Gemini Analysis Error:", e);
    if (e.message?.includes("API_KEY_INVALID")) {
      throw new Error("Geçersiz API Anahtarı. Lütfen GEMINI_API_KEY değerini kontrol edin.");
    }
    throw new Error("Analiz başarısız oldu: " + (e.message || "Bilinmeyen AI hatası"));
  }
};
