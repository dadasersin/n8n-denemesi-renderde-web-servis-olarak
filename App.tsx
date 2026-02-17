
import React, { useState, useEffect } from 'react';
import { analyzeDockerError } from './services/geminiService';
import { AnalysisResult, Status } from './types';
import { CodeBlock } from './components/CodeBlock';

const App: React.FC = () => {
  const [errorInput, setErrorInput] = useState<string>(
    `==> https://github.com/dadasersin/n8n-denemesi adresinden klonlanıyor 
Menu
==> main dalındaki b0768fe6959ee6c91bac9ece0d6c3ea626435e5d commit'ini kontrol ediliyor. 
#1 [dahili] Dockerfile'dan derleme tanımını yükle
#1 Dockerfile aktarımı: 2B tamamlandı
#1 TAMAMLANDI 0.0s
Hata: Çözümlenemedi: Dockerfile okunamadı: Dockerfile açılamadı: Böyle bir dosya veya dizin yok`
  );
  const [contextInput, setContextInput] = useState<string>('n8n deployment on a remote server via git clone');
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!errorInput.trim()) return;

    setStatus(Status.LOADING);
    setErrorMessage(null);
    try {
      const data = await analyzeDockerError(errorInput, contextInput);
      setResult(data);
      setStatus(Status.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Analysis failed. Please check your network or API key.');
      setStatus(Status.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">DockerConfig AI</h1>
              <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">DevOps Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Gemini 3 Flash Online
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="xl:col-span-5 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Input Terminal
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">BUILD LOGS / ERROR MESSAGE</label>
                  <div className="relative">
                    <textarea
                      value={errorInput}
                      onChange={(e) => setErrorInput(e.target.value)}
                      placeholder="Paste your terminal logs here..."
                      className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all mono text-sm leading-relaxed"
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] text-slate-600 font-mono">
                      UTF-8 LOGS
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">DEPLOYMENT CONTEXT</label>
                  <input
                    type="text"
                    value={contextInput}
                    onChange={(e) => setContextInput(e.target.value)}
                    placeholder="e.g. VPS, n8n, nodejs, python..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={status === Status.LOADING}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
                    status === Status.LOADING
                      ? 'bg-slate-800 cursor-not-allowed text-slate-500'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20'
                  }`}
                >
                  {status === Status.LOADING ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing Cluster Logs...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span>Diagnose & Solve</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Hint Box */}
            <div className="p-5 bg-blue-900/10 border border-blue-900/30 rounded-2xl flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-300">Pro Tip</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  In your case, Docker is complaining because there is no <code className="text-blue-400 font-mono">Dockerfile</code> in the repository root. Make sure to check the repository structure after cloning.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="xl:col-span-7">
            {status === Status.IDLE && (
              <div className="h-full min-h-[500px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center opacity-40">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-400">Awaiting Diagnostics</h3>
                <p className="text-slate-500 mt-2 max-w-xs">Paste your logs and click solve to get AI-powered deployment fixes.</p>
              </div>
            )}

            {status === Status.ERROR && (
              <div className="p-8 bg-red-900/10 border border-red-900/40 rounded-3xl text-red-400 flex items-start gap-4 animate-in slide-in-from-bottom-4 duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="font-bold text-lg">System Error</h3>
                  <p className="mt-1 opacity-80">{errorMessage}</p>
                  <button onClick={handleAnalyze} className="mt-4 text-xs font-bold uppercase tracking-wider bg-red-900/30 px-4 py-2 rounded-lg hover:bg-red-900/50 transition-colors">
                    Retry Operation
                  </button>
                </div>
              </div>
            )}

            {status === Status.SUCCESS && result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Analysis Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950">
                    <div className="flex items-center gap-2 text-indigo-400 mb-6 uppercase tracking-widest text-[10px] font-black">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      Diagnostic Report
                    </div>
                    
                    <div className="mb-10">
                      <h3 className="text-xl font-bold text-white mb-3">Root Cause Analysis</h3>
                      <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-2xl">
                         <p className="text-slate-300 leading-relaxed text-sm">
                          {result.explanation}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        Resolution Steps
                      </h3>
                      <div className="prose prose-invert max-w-none prose-sm text-slate-400 leading-relaxed whitespace-pre-wrap bg-slate-950/50 border border-slate-800 p-5 rounded-2xl">
                        {result.solution}
                      </div>
                    </div>
                  </div>

                  {/* Files Card */}
                  <div className="p-8 bg-slate-950/30">
                    <h3 className="text-sm font-black text-slate-500 mb-6 uppercase tracking-[0.2em] flex items-center justify-between">
                      Configuration Patch
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20 lowercase tracking-normal">verified by ai</span>
                    </h3>
                    <div className="space-y-4">
                      {result.files.map((file, idx) => (
                        <CodeBlock 
                          key={idx} 
                          filename={file.name} 
                          language={file.language} 
                          content={file.content} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Feedback */}
                <div className="text-center py-4">
                  <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                    Build successfully analyzed with Gemini-3-Flash
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-900 py-12 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 grayscale opacity-40">
             <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
             </div>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">OSS-PROJECT</span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            &copy; 2025 DockerConfig AI Engine. Specialized for n8n & Node.js CI/CD workflows.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
