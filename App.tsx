import React, { useState, useEffect } from 'react';
import { analyzeN8nLogs } from './services/geminiService';
import { AnalysisResult, DiagnosticStatus } from './types';

const App: React.FC = () => {
  const [logs, setLogs] = useState('');
  const [status, setStatus] = useState<DiagnosticStatus>(DiagnosticStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFixSection, setShowFixSection] = useState(false);

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
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] font-sans">
      {/* Header */}
      <header className="bg-[#4338ca] text-white py-10 px-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white p-3 rounded-2xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#4338ca]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">n8n Render Troubleshooter</h1>
          </div>
          <p className="text-xl text-indigo-100 max-w-2xl leading-relaxed">
            Render.com üzerindeki n8n kurulumunda karşılaşılan <strong>"Sunucuyla bağlantı kesildi"</strong> ve çökme sorunlarını AI ile teşhis edin.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-10 space-y-10">

        {!hasApiKey && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-xl shadow-sm animate-pulse">
            <div className="flex items-center gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-lg font-bold text-amber-800">GEMINI_API_KEY Eksik!</h3>
                <p className="text-amber-700">Analiz motorunun çalışması için Render panelinde <strong>GEMINI_API_KEY</strong> değişkenini tanımlamalısınız.</p>
              </div>
            </div>
          </div>
        )}

        {/* Hata Nerede? Section */}
        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <span className="bg-red-100 text-red-600 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                Hata Nerede? Neden Bağlantı Kesiliyor?
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                <p>
                  n8n'in Render'da "Bağlantı kesildi" demesinin <strong>asıl sebebi</strong> genellikle şunlardır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Port Çakışması:</strong> n8n varsayılan olarak 5678 portunu kullanır, ancak Render uygulamanızdan 10000 portunu (veya `$PORT` değişkenini) dinlemesini bekler.</li>
                  <li><strong>Bellek (RAM) Yetersizliği:</strong> Render Ücretsiz planı 512MB RAM sunar. n8n ağır bir iş akışı çalıştırdığında bu sınırı aşar ve sistem tarafından anında durdurulur (OOM Kill).</li>
                  <li><strong>Dosya Sistemi Kilitleri:</strong> SQLite veritabanı ağ disklerinde bazen kilitlenir ve n8n'in yanıt vermesini durdurur.</li>
                </ul>
                <button
                  onClick={() => setShowFixSection(!showFixSection)}
                  className="mt-4 text-indigo-600 font-bold hover:underline flex items-center gap-2"
                >
                  {showFixSection ? '↑ Çözüm Adımlarını Gizle' : '↓ Kesin Çözüm Ayarlarını Göster'}
                </button>
              </div>
            </div>

            <div className="md:w-1/3 bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">10s</div>
              <h3 className="font-bold text-slate-800">Hızlı Teşhis</h3>
              <p className="text-sm text-slate-500 mt-2">Loglarınızı aşağıya yapıştırın, Gemini hatayı tam olarak bulsun.</p>
            </div>
          </div>

          {showFixSection && (
            <div className="mt-10 pt-10 border-t border-slate-100 animate-in slide-in-from-top-4 duration-500">
               <h3 className="text-xl font-bold text-slate-800 mb-6">Render.com İçin Altın Ayarlar</h3>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                     <h4 className="font-black text-emerald-800 uppercase text-xs tracking-widest mb-4">Environment Variables</h4>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-emerald-200">
                           <code className="text-emerald-700 font-bold text-sm">N8N_PORT</code>
                           <code className="text-slate-500 font-mono text-xs">$PORT</code>
                        </div>
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-emerald-200">
                           <code className="text-emerald-700 font-bold text-sm">N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS</code>
                           <code className="text-slate-500 font-mono text-xs">false</code>
                        </div>
                     </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                     <h4 className="font-black text-blue-800 uppercase text-xs tracking-widest mb-4">Settings</h4>
                     <p className="text-sm text-blue-700 leading-relaxed">
                        <strong>Web Service</strong> olarak kurduğunuzdan emin olun. <br/>
                        <strong>Start Command:</strong> kısmına `n8n start` yazın. (Boş bırakmayın!)
                     </p>
                  </div>
               </div>
            </div>
          )}
        </section>

        {/* Log Input Section */}
        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-black text-slate-800 mb-4">Render Loglarını Analiz Et</h2>
            <p className="text-slate-500 mb-6">Render panelindeki 'Logs' sekmesindeki metni buraya yapıştırın.</p>
            <div className="relative">
              <textarea
                className="w-full h-64 p-6 bg-slate-900 text-slate-100 rounded-3xl font-mono text-sm focus:ring-4 focus:ring-indigo-500/20 outline-none border-none resize-none shadow-inner"
                placeholder="Örnek: [n8n] Error: database is locked..."
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
              />
              <div className="absolute top-4 right-4 text-slate-500 text-[10px] font-mono bg-white/5 px-2 py-1 rounded">
                TERMINAL INPUT
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={status === DiagnosticStatus.ANALYZING || !logs.trim() || !hasApiKey}
              className={`mt-8 w-full py-5 px-8 rounded-2xl font-black text-lg text-white transition-all shadow-xl ${
                status === DiagnosticStatus.ANALYZING || !hasApiKey
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-[#4338ca] hover:bg-[#3730a3] active:transform active:scale-[0.98] shadow-indigo-500/20'
              }`}
            >
              {status === DiagnosticStatus.ANALYZING ? 'Gemini Analiz Ediyor...' : 'Hata Loglarını Teşhis Et'}
            </button>
          </div>
        </section>

        {/* Results */}
        {status === DiagnosticStatus.SUCCESS && result && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 pb-20">
            <div className="bg-white border-4 border-emerald-500/20 rounded-[2.5rem] p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
                <h2 className="text-3xl font-black text-emerald-900">Teşhis Tamamlandı</h2>
              </div>
              <p className="text-emerald-800 text-xl leading-relaxed font-medium">{result.diagnosis}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Muhtemel Sebepler</h3>
                <ul className="space-y-6">
                  {result.probableCauses.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-5 group">
                      <div className="mt-1 h-6 w-6 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors">
                        <span className="text-[10px] font-bold text-indigo-600 group-hover:text-white">{idx + 1}</span>
                      </div>
                      <span className="text-slate-700 font-medium text-lg leading-snug">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Önerilen Çözüm Planı</h3>
                <div className="space-y-10">
                  {result.suggestedFixes.map((fix, idx) => (
                    <div key={idx} className="relative pl-10 border-l-2 border-slate-100 last:border-0 pb-10 last:pb-0">
                      <div className="absolute top-0 left-[-11px] w-5 h-5 rounded-full bg-white border-2 border-indigo-500 shadow-sm"></div>
                      <h4 className="font-black text-indigo-900 text-xl mb-2">{fix.title}</h4>
                      <p className="text-slate-600 mb-6 leading-relaxed">{fix.description}</p>
                      {fix.code && (
                        <div className="relative group">
                          <pre className="bg-slate-900 text-indigo-300 p-6 rounded-3xl text-sm font-mono overflow-x-auto shadow-2xl">
                            <code>{fix.code}</code>
                          </pre>
                          <button
                            className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest bg-white/10 text-white/60 hover:text-white hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
                            onClick={() => {
                              navigator.clipboard.writeText(fix.code || '');
                              alert('Panoya kopyalandı!');
                            }}
                          >
                            COPY
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {status === DiagnosticStatus.ERROR && (
           <div className="bg-red-50 border-2 border-red-100 p-8 rounded-3xl text-center">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-xl font-bold text-red-900">Analiz Başarısız</h3>
              <p className="text-red-700 mt-2">{error}</p>
              <button onClick={handleAnalyze} className="mt-6 px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">Yeniden Dene</button>
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-20 px-6 mt-20 border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h3 className="text-white font-black text-xl mb-2 italic tracking-tighter">DockerConfig AI</h3>
            <p className="text-sm max-w-xs">Gemini 3 Flash tarafından güçlendirilmiş, n8n ve Render odaklı DevOps asistanı.</p>
          </div>
          <div className="flex gap-10 text-xs font-bold uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-white cursor-pointer transition-colors">Render Support</span>
            <span className="hover:text-white cursor-pointer transition-colors">n8n Tips</span>
          </div>
          <p className="text-[10px] text-slate-600">© 2025 DockerConfig AI Engine.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
