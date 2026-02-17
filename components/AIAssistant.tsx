
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Merhaba! n8n kurulumu veya YouTube/Gemini otomasyonu hakkında sana nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // API Key kontrolü
  const apiKey = process.env.API_KEY;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (!apiKey || apiKey === "") {
      setMessages(prev => [
        ...prev, 
        { role: 'user', text: input.trim() },
        { role: 'ai', text: '⚠️ API_KEY bulunamadı! Render panelinde "Environment" sekmesine giderek API_KEY eklediğinizden emin olun.' }
      ]);
      setInput('');
      return;
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Sen bir n8n ve Hugging Face uzmanısın. Kullanıcıya Hugging Face Spaces üzerinde n8n kurulumu, Dockerfile yapılandırması ve otomasyon senaryoları (özellikle YouTube trendleri çekip Gemini ile senaryo yazma) konularında yardımcı oluyorsun. Cevaplarını Türkçe ve teknik ama anlaşılır şekilde ver.`,
        }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Yanıt oluşturulamadı." }]);
    } catch (error: any) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Hata: " + (error.message || "Bilinmeyen bir hata oluştu.") }]);
    } finally {
      setLoading(true); // Küçük bir gecikme için
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4 font-semibold text-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          Gemini n8n Asistanı
        </div>
        {!apiKey && (
          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold">API KEY EKSİK</span>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-slate-400 text-xs">
              Düşünüyor...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Sorunuzu yazın..."
          className="flex-1 px-4 py-2 bg-slate-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Gönder
        </button>
      </div>
    </div>
  );
};
