import React, { useState, useEffect } from 'react';
import { analyzeN8nLogs } from './services/geminiService';
import { AnalysisResult, DiagnosticStatus } from './types';

const App: React.FC = () => {
  const [logs, setLogs] = useState('');
  const [status, setStatus] = useState<DiagnosticStatus>(DiagnosticStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFixSection, setShowFixSection] = useState(false);
  const [showSupabase, setShowSupabase] = useState(false);

  // Check for API Key
  const [hasApiKey, setHasApiKey] = useState(true);
  useEffect(() => {
    const apiKey = (window as any).process?.env?.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    if (!apiKey) {
      setHasApiKey(false);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!logs.trim()) return;

    setStatus(DiagnosticStatus.ANALYZING);
    setError(null);

    try {
      const diagnosis = await analyzeN8nLogs(logs);
      setResult(diagnosis);
      setStatus(DiagnosticStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError("Analiz sırasında bir hata oluştu. API anahtarınızın geçerli olduğundan veya logların okunabilir olduğundan emin olun.");
      setStatus(DiagnosticStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-12 px-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full -mr-48 -mt-48 blur-3xl opacity-50"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-block bg-white/20 backdrop-blur-md p-3 rounded-2xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">n8n Render Troubleshooter</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
            Render.com'da <strong>"Sunucuyla bağlantı kesildi"</strong> hatasına SON! AI destekli log analizi ve Supabase entegrasyon rehberi.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-10 space-y-12">

        {/* Supabase Ultimate Fix Section */}
        <section className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10">
             <svg className="w-64 h-64" viewBox="0 0 24 24" fill="currentColor"><path d="M21.397 12c0 5.187-4.204 9.393-9.395 9.393S2.607 17.187 2.607 12s4.204-9.393 9.395-9.393S21.397 6.813 21.397 12zM12 4.607a7.393 7.393 0 100 14.786 7.393 7.393 0 000-14.786z"/></svg>
          </div>
          <div className="relative z-10">
            <span className="bg-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 inline-block">Kalıcı Çözüm</span>
            <h2 className="text-3xl md:text-4xl font-black mb-6">Supabase ile Bağlantı Kopmalarını Bitirin</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Render'ın ücretsiz planındaki SQLite kısıtlamaları n8n'i dondurur. Supabase (PostgreSQL) kullanarak verilerinizi harici bir veritabanında saklayın, hızınızı ve stabilitenizi %500 artırın.
            </p>
            <div className="flex flex-wrap gap-4">
               <button
                onClick={() => setShowSupabase(!showSupabase)}
                className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black transition-all hover:bg-indigo-50 active:scale-95 shadow-lg shadow-black/20"
               >
                 {showSupabase ? 'REHBERİ KAPAT' : 'SUPABASE KURULUM REHBERİ'}
               </button>
            </div>

            {showSupabase && (
              <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 animate-in fade-in zoom-in duration-500">
                <h3 className="text-xl font-bold mb-6 text-emerald-400 italic">Render Environment Variables (Supabase Ayarları)</h3>
                <p className="text-sm text-slate-400 mb-6">Aşağıdaki değişkenleri Render panelindeki 'Environment' sekmesine ekleyin:</p>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div><label className="text-[10px] uppercase font-bold text-slate-500">DB_TYPE</label><code className="block bg-black/40 p-3 rounded-xl text-emerald-400 mt-1 select-all font-mono text-sm">postgresdb</code></div>
                      <div><label className="text-[10px] uppercase font-bold text-slate-500">DB_POSTGRESDB_PORT</label><code className="block bg-black/40 p-3 rounded-xl text-emerald-400 mt-1 select-all font-mono text-sm">5432</code></div>
                      <div><label className="text-[10px] uppercase font-bold text-slate-500">DB_POSTGRESDB_DATABASE</label><code className="block bg-black/40 p-3 rounded-xl text-emerald-400 mt-1 select-all font-mono text-sm">postgres</code></div>
                   </div>
                   <div className="space-y-4">
                      <div><label className="text-[10px] uppercase font-bold text-slate-500">DB_POSTGRESDB_HOST</label><code className="block bg-black/40 p-3 rounded-xl text-emerald-400 mt-1 select-all font-mono text-xs italic opacity-80">db.xyz.supabase.co</code></div>
                      <div><label className="text-[10px] uppercase font-bold text-slate-500">DB_POSTGRESDB_USER</label><code className="block bg-black/40 p-3 rounded-xl text-emerald-400 mt-1 select-all font-mono text-sm">postgres</code></div>
                      <div><label className="text-[10px] uppercase font-bold text-slate-500">DB_POSTGRESDB_PASSWORD</label><code className="block bg-black/40 p-3 rounded-xl text-emerald-400 mt-1 select-all font-mono text-xs italic opacity-80">Supabase Şifreniz</code></div>
                   </div>
                </div>
                <div className="mt-8 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-xs text-emerald-300">
                   <strong>İPUCU:</strong> Bu ayarlar yapıldıktan sonra Render servisinizi yeniden başlatın. "Bağlantı kesildi" hatasının artık gelmediğini göreceksiniz.
                </div>
              </div>
            )}
          </div>
        </section>

        {!hasApiKey && (
          <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl shadow-sm text-center">
            <h3 className="text-lg font-bold text-amber-800 mb-2">GEMINI_API_KEY Eksik!</h3>
            <p className="text-amber-700 text-sm">AI teşhisi için Render panelinde <strong>GEMINI_API_KEY</strong> tanımlamalısınız.</p>
          </div>
        )}

        {/* Diagnostic Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Left: Log Analysis */}
           <div className="lg:col-span-7 space-y-8">
              <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 md:p-10">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                   </div>
                   Log Analiz Motoru
                </h2>
                <textarea
                  className="w-full h-80 p-6 bg-slate-900 text-slate-100 rounded-3xl font-mono text-xs focus:ring-4 focus:ring-indigo-500/10 outline-none border-none resize-none shadow-inner mb-6"
                  placeholder="Render panelindeki Logları buraya yapıştırın..."
                  value={logs}
                  onChange={(e) => setLogs(e.target.value)}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={status === DiagnosticStatus.ANALYZING || !logs.trim() || !hasApiKey}
                  className={`w-full py-5 rounded-2xl font-black text-white transition-all shadow-xl ${
                    status === DiagnosticStatus.ANALYZING || !hasApiKey
                    ? 'bg-slate-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 active:scale-[0.98]'
                  }`}
                >
                  {status === DiagnosticStatus.ANALYZING ? 'Analiz Ediliyor...' : 'Hata Teşhisini Başlat'}
                </button>
              </section>
           </div>

           {/* Right: Quick Facts */}
           <div className="lg:col-span-5 space-y-8">
              <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Neden Bağlantı Kopuyor?</h3>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center shrink-0 font-bold">1</div>
                      <p className="text-sm text-slate-600 leading-relaxed"><strong className="text-slate-800">Yanlış Port:</strong> n8n 5678'de başlar ama Render 10000 bekler. <code className="text-[10px] bg-slate-100 px-1 rounded">N8N_PORT=10000</code> şarttır.</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0 font-bold">2</div>
                      <p className="text-sm text-slate-600 leading-relaxed"><strong className="text-slate-800">Bellek (RAM):</strong> Ücretsiz 512MB RAM n8n'e yetmeyince Render servisi kapatır.</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 font-bold">3</div>
                      <p className="text-sm text-slate-600 leading-relaxed"><strong className="text-slate-800">SQLite Kilidi:</strong> Aynı anda çok fazla veri yazılınca veritabanı kilitlenir.</p>
                   </div>
                </div>
              </section>
           </div>
        </div>

        {/* Results */}
        {status === DiagnosticStatus.SUCCESS && result && (
          <section className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-10 pb-24">
            <div className="bg-white border-2 border-emerald-500 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <svg className="w-32 h-32 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-6">Teşhis Sonucu</h2>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">{result.diagnosis}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Muhtemel Sebepler</h3>
                <ul className="space-y-6">
                  {result.probableCauses.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                      <span className="text-slate-700 font-medium">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Önerilen Çözümler</h3>
                <div className="space-y-8">
                  {result.suggestedFixes.map((fix, idx) => (
                    <div key={idx} className="group">
                      <h4 className="font-black text-slate-800 text-lg mb-2">{fix.title}</h4>
                      <p className="text-slate-500 text-sm mb-4 leading-relaxed">{fix.description}</p>
                      {fix.code && (
                        <div className="relative">
                          <pre className="bg-slate-900 text-indigo-300 p-5 rounded-2xl text-[10px] font-mono overflow-x-auto shadow-inner">
                            <code>{fix.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 py-16 px-6 mt-12">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase font-black tracking-widest mb-4">n8n Reliability assistant</p>
          <p className="text-slate-600 text-[10px]">Gemini 3 Flash Engine © 2025 DockerConfig AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
