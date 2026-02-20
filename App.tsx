import React, { useState, useEffect } from 'react';
import { analyzeN8nLogs } from './services/geminiService';
import { AnalysisResult } from './types';
import ApiHealthCheck from "./components/ApiHealthCheck";

enum DiagnosticStatus {
  IDLE,
  ANALYZING,
  SUCCESS,
  ERROR
}

const WORKFLOW_JSON = {
  "nodes": [
    {
      "parameters": { "options": {} },
      "type": "n8n-nodes-base.chatTrigger",
      "typeVersion": 1,
      "position": [0, 0],
      "id": "chat-trigger",
      "name": "When Chat Message Received"
    },
    {
      "parameters": { "options": {} },
      "type": "n8n-nodes-base.aiAgent",
      "typeVersion": 1,
      "position": [200, 0],
      "id": "ai-agent",
      "name": "AI Agent"
    },
    {
      "parameters": {
        "modelName": "models/gemini-1.5-flash",
        "options": {}
      },
      "type": "n8n-nodes-base.googleGeminiChatModel",
      "typeVersion": 1,
      "position": [200, 200],
      "id": "gemini-model",
      "name": "Google Gemini Chat Model"
    }
  ],
  "connections": {
    "When Chat Message Received": {
      "main": [[{ "node": "AI Agent", "type": "main", "index": 0 }]]
    },
    "Google Gemini Chat Model": {
      "ai_languageModel": [[{ "node": "AI Agent", "type": "ai_languageModel", "index": 0 }]]
    }
  }
};

const App: React.FC = () => {
  const [logs, setLogs] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<DiagnosticStatus>(DiagnosticStatus.IDLE);
  const [showSupabase, setShowSupabase] = useState(false);
  const [showAIConfig, setShowAIConfig] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  const handleAnalyze = async () => {
    setStatus(DiagnosticStatus.ANALYZING);
    try {
      const data = await analyzeN8nLogs(logs);
      setResult(data);
      setStatus(DiagnosticStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setStatus(DiagnosticStatus.ERROR);
      alert(error.message);
    }
  };

  const copyWorkflow = () => {
    navigator.clipboard.writeText(JSON.stringify(WORKFLOW_JSON, null, 2));
    alert("Workflow JSON kopyalandı! n8n içine yapıştırabilirsiniz.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 pt-20 pb-32 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-8 border border-white/20 shadow-2xl">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">n8n Render Troubleshooter</h1>
          <p className="text-xl md:text-2xl text-indigo-100 font-medium max-w-2xl mx-auto leading-relaxed">
            Render.com'da <strong className="text-white border-b-2 border-indigo-400">"Sunucuyla bağlantı kesildi"</strong> hatasına SON! AI destekli log analizi ve AI Chat rehberi.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-20 relative z-10 space-y-12">
        {/* Solution Toggle Section */}
        <section className="bg-slate-900 rounded-[3rem] p-10 md:p-14 shadow-2xl text-white overflow-hidden relative border border-white/10">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-6 justify-center">
               <button
                 onClick={() => setShowSupabase(!showSupabase)}
                 className={`px-8 py-5 rounded-2xl font-black text-sm transition-all transform hover:scale-105 ${showSupabase ? 'bg-emerald-500 text-white shadow-emerald-500/40' : 'bg-white/10 hover:bg-white/20'}`}
               >
                 {showSupabase ? 'REHBERİ KAPAT' : 'SUPABASE KURULUM REHBERİ'}
               </button>
               <button
                 onClick={() => setShowAIConfig(!showAIConfig)}
                 className={`px-8 py-5 rounded-2xl font-black text-sm transition-all transform hover:scale-105 ${showAIConfig ? 'bg-indigo-500 text-white shadow-indigo-500/40' : 'bg-white/10 hover:bg-white/20'}`}
               >
                 {showAIConfig ? 'REHBERİ KAPAT' : 'AI CHAT (YAPAY ZEKA) KURULUMU'}
               </button>
            </div>

            {showSupabase && (
              <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 animate-in fade-in zoom-in duration-500">
                <h3 className="text-xl font-bold mb-6 text-emerald-400 italic">Supabase (PostgreSQL) Ayarları</h3>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div><label className="text-[10px] uppercase font-bold text-slate-500">DB_TYPE</label><code className="block bg-black/40 p-3 rounded-xl text-emerald-400 mt-1 select-all font-mono text-sm">postgresdb</code></div>
                      <div><label className="text-[10px] uppercase font-bold text-slate-500">DB_POSTGRESDB_HOST</label><code className="block bg-black/40 p-3 rounded-xl text-emerald-400 mt-1 select-all font-mono text-xs opacity-80">db.xyz.supabase.co</code></div>
                   </div>
                   <div className="space-y-4">
                      <div><label className="text-[10px] uppercase font-bold text-slate-500">DB_POSTGRESDB_PORT</label><code className="block bg-black/40 p-3 rounded-xl text-emerald-400 mt-1 select-all font-mono text-sm">5432</code></div>
                      <div><label className="text-[10px] uppercase font-bold text-slate-500">DB_POSTGRESDB_PASSWORD</label><code className="block bg-black/40 p-3 rounded-xl text-emerald-400 mt-1 select-all font-mono text-sm">Şifreniz</code></div>
                   </div>
                </div>
              </div>
            )}

            {showAIConfig && (
              <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 animate-in fade-in zoom-in duration-500">
                <h3 className="text-xl font-bold mb-4 text-indigo-400 italic">n8n'de Yapay Zeka (AI Chat) Nasıl Kullanılır?</h3>
                <p className="text-sm text-slate-400 mb-6">Aşağıdaki adımları takip ederek Gemini tabanlı bir AI Chat kurabilirsiniz:</p>

                <div className="space-y-6">
                   <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                      <p className="text-white text-sm font-bold mb-3">1. Hazır Workflow'u Kopyalayın</p>
                      <button onClick={copyWorkflow} className="text-xs bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-bold">WORKFLOW KODUNU KOPYALA</button>
                      <p className="text-[10px] text-slate-500 mt-2">Kopyaladıktan sonra n8n sayfasına gidip CTRL+V (Yapıştır) yapın.</p>
                   </div>
                   <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                      <p className="text-white text-sm font-bold mb-3">2. Gemini API Key Ekleyin</p>
                      <p className="text-xs text-slate-300">"Google Gemini Chat Model" düğümüne tıklayın, Credentials kısmından yeni bir "Google Gemini API" hesabı oluşturun ve API anahtarınızı yapıştırın.</p>
                   </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Diagnostic Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Left: Log Analysis */}
           <div className="lg:col-span-7 space-y-8">
              <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 md:p-10">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">Log Analiz Motoru</h2>
                <textarea
                  className="w-full h-80 p-6 bg-slate-900 text-slate-100 rounded-3xl font-mono text-xs focus:ring-4 focus:ring-indigo-500/10 outline-none border-none resize-none shadow-inner mb-6"
                  placeholder="Render panelindeki Logları buraya yapıştırın..."
                  value={logs}
                  onChange={(e) => setLogs(e.target.value)}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={status === DiagnosticStatus.ANALYZING || !logs.trim()}
                  className="w-full py-5 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl transition-all"
                >
                  {status === DiagnosticStatus.ANALYZING ? 'Analiz Ediliyor...' : 'Hata Teşhisini Başlat'}
                </button>
              </section>
           </div>

           {/* Right: Connection Test & Quick Facts */}
           <div className="lg:col-span-5 space-y-8">
              <ApiHealthCheck />
              <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Hızlı Bilgiler</h3>
                <div className="space-y-6">
                   <p className="text-sm text-slate-600"><strong>URL:</strong> n8n arayüzüne <code>/home/chat</code> yerine önce ana sayfadan giriş yapmayı deneyin.</p>
                   <p className="text-sm text-slate-600"><strong>AI RAM:</strong> Yapay zeka modülleri çok RAM harcar. Supabase kullanmak n8n'in yükünü hafifletir.</p>
                </div>
              </section>
           </div>
        </div>

        {/* Results */}
        {status === DiagnosticStatus.SUCCESS && result && (
          <section className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-10 pb-24">
            <div className="bg-white border-2 border-emerald-500 rounded-[2.5rem] p-10 shadow-2xl">
              <h2 className="text-3xl font-black text-slate-800 mb-6">Teşhis Sonucu</h2>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">{result.diagnosis}</p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 py-16 px-6 mt-12">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase font-black tracking-widest mb-4">n8n Reliability assistant</p>
          <p className="text-slate-600 text-[10px]">Gemini 1.5 Flash Engine © 2025 DockerConfig AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
