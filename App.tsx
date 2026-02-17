
import React, { useState, useEffect } from 'react';
import { analyzeDockerError } from './services/geminiService';
import { AnalysisResult, Status } from './types';
import { CodeBlock } from './components/CodeBlock';

const App: React.FC = () => {
  const [errorInput, setErrorInput] = useState<string>(
    `==> https://github.com/dadasersin/n8n-denemesi adresinden klonlanıyor 
==> main dalındaki 2aaefeb5bb5f3d6b7b820726a2c6d8f7483bece3 commit'ini kontrol ediliyor. 
Menu
#1 [dahili] Dockerfile'dan derleme tanımını yükle
#1 Dockerfile aktarımı: 2B tamamlandı
#1 TAMAMLANDI 0.0s
Hata: Çözümlenemedi: Dockerfile okunamadı: Dockerfile açılamadı: Böyle bir dosya veya dizin yok`
  );
  const [contextInput, setContextInput] = useState<string>('Render.com or similar cloud platform deployment for n8n-denemesi');
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
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">DockerConfig AI</h1>
              <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-black">Render Deployment Specialist</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Gemini 3 Flash v2.5
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Left Column: Input Terminal */}
          <div className="xl:col-span-5 space-y-8">
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13.983 11l2.357-2.357-1.414-1.414L12.569 9.57 10.212 7.213 8.798 8.627 11.155 10.984l-2.357 2.357 1.414 1.414 2.357-2.357 2.357 2.357 1.414-1.414L13.983 11z"/></svg>
              </div>

              <h2 className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                Deployment Log
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2 px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Terminal Output</label>
                    <span className="text-[10px] text-indigo-400/60 font-mono">ERROR DETECTED</span>
                  </div>
                  <textarea
                    value={errorInput}
                    onChange={(e) => setErrorInput(e.target.value)}
                    placeholder="Paste logs from Render or other platforms..."
                    className="w-full h-72 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all mono text-sm leading-relaxed shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-wider px-1">Deployment Target</label>
                  <input
                    type="text"
                    value={contextInput}
                    onChange={(e) => setContextInput(e.target.value)}
                    placeholder="e.g. Render, Railway, Vercel, DigitalOcean..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm shadow-inner"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={status === Status.LOADING}
                  className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 transition-all transform active:scale-[0.97] group ${
                    status === Status.LOADING
                      ? 'bg-slate-800 cursor-not-allowed text-slate-500'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)]'
                  }`}
                >
                  {status === Status.LOADING ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Diagnosing Build...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span>Fix Deployment</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-indigo-300">Quick Debug Tip</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Render typically requires a <code className="text-indigo-400 font-mono">Dockerfile</code> to build a custom container. If you're seeing "no such file or directory", the platform can't find your instructions in the root of the repository.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Diagnostics */}
          <div className="xl:col-span-7">
            {status === Status.IDLE && (
              <div className="h-full border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center bg-slate-900/10">
                <div className="w-24 h-24 bg-slate-900/80 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-400">Ready to Fix Build</h3>
                <p className="text-slate-500 mt-3 max-w-sm leading-relaxed">Paste your Render/Docker error logs. We'll generate the missing Dockerfile and explain why the build failed.</p>
              </div>
            )}

            {status === Status.ERROR && (
              <div className="p-10 bg-red-900/10 border border-red-900/30 rounded-[2.5rem] text-red-400 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-5">
                  <div className="p-3 bg-red-900/20 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-black text-xl uppercase tracking-wider">Analysis Failed</h3>
                    <p className="mt-2 text-slate-400 leading-relaxed">{errorMessage}</p>
                    <button onClick={handleAnalyze} className="mt-8 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20">
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {status === Status.SUCCESS && result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">
                {/* Master Report */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
                  <div className="p-10 border-b border-slate-800/50">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-3 text-indigo-400 uppercase tracking-[0.3em] text-[10px] font-black">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                        Render Build Analysis
                      </div>
                      <div className="text-[10px] font-mono text-slate-600 bg-slate-950 px-3 py-1 rounded-full">
                        BUILD_FAIL_FIX_V2
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Why is this failing?</h3>
                        <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/50 shadow-inner">
                          <p className="text-slate-300 leading-relaxed text-sm">
                            {result.explanation}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Fix Instructions</h3>
                        <div className="bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/10 shadow-inner">
                          <div className="prose prose-invert prose-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {result.solution}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Artifacts */}
                  <div className="p-10 bg-slate-950/50">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Missing Configuration
                      </h3>
                      <span className="text-[10px] text-slate-600 font-mono uppercase">Add these to your repo</span>
                    </div>
                    
                    <div className="space-y-6">
                      {result.files.map((file, idx) => (
                        <div key={idx} className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                          <div className="relative">
                            <CodeBlock 
                              filename={file.name} 
                              language={file.language} 
                              content={file.content} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="mt-24 border-t border-slate-900 bg-slate-950/50 py-16 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 opacity-60">
              <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
                 <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Deployment Diagnostics</span>
            </div>
            <p className="text-xs text-slate-600 font-medium max-w-xs leading-relaxed">
              Automated container orchestration assistant. Optimized for n8n self-hosting on platforms like Render.
            </p>
          </div>
          
          <div className="flex justify-center md:border-x md:border-slate-900 py-4">
            <div className="text-center">
              <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Service Status</div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                <span className="text-sm font-bold text-slate-300">Cluster 01-A Active</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
             <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Built with precision</div>
             <p className="text-xs text-slate-600 font-medium">
               &copy; 2025 DockerConfig AI Platform.
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
