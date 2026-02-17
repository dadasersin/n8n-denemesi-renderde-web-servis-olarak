
import React, { useState } from 'react';
import { analyzeDockerError } from './services/geminiService';
import { AnalysisResult, Status } from './types';
import { CodeBlock } from './components/CodeBlock';

const App: React.FC = () => {
  const [errorInput, setErrorInput] = useState<string>(
    'Error: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory'
  );
  const [contextInput, setContextInput] = useState<string>('Project: n8n-denemesi (likely an n8n self-hosting trial)');
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
      setErrorMessage(err.message || 'Failed to analyze the error. Please check your API key and try again.');
      setStatus(Status.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              DockerConfig AI
            </h1>
          </div>
          <div className="hidden md:block text-xs text-slate-500 font-medium">
            Powered by Gemini 3 Flash
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Debug Deployment Errors</h2>
            <p className="text-slate-400">Paste your Docker build or n8n deployment logs to get instant analysis and configuration fixes.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Error Logs</label>
                <textarea
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  placeholder="Paste the error from your terminal here..."
                  className="w-full h-48 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all mono text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Additional Context (Optional)</label>
                <input
                  type="text"
                  value={contextInput}
                  onChange={(e) => setContextInput(e.target.value)}
                  placeholder="e.g. Trying to deploy n8n to a VPS"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={status === Status.LOADING}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  status === Status.LOADING
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                }`}
              >
                {status === Status.LOADING ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Generate Solution
                  </>
                )}
              </button>
            </div>

            {/* Quick Tips Section */}
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Docker Fixes</h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center shrink-0">
                    <span className="text-blue-400 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Missing Dockerfile</p>
                    <p className="text-xs text-slate-500 mt-1">Ensure your Dockerfile is in the project root and is named exactly "Dockerfile" with no extension.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center shrink-0">
                    <span className="text-blue-400 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Permissions Error</p>
                    <p className="text-xs text-slate-500 mt-1">On Linux, you may need to prefix commands with sudo or add your user to the docker group.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center shrink-0">
                    <span className="text-blue-400 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Context Issues</p>
                    <p className="text-xs text-slate-500 mt-1">Run docker build from the folder containing your source code. Use . to represent current directory.</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">n8n Specific Note</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The official n8n Docker image is <code className="bg-slate-800 px-1 rounded text-yellow-400">n8nio/n8n</code>. 
                  Don't build your own unless you need custom modules installed!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {status === Status.ERROR && (
          <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-xl text-red-400 flex items-center gap-3 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{errorMessage}</p>
          </div>
        )}

        {status === Status.SUCCESS && result && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 md:p-8 border-b border-slate-800">
                <div className="flex items-center gap-2 text-blue-400 mb-4 uppercase tracking-widest text-xs font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Analysis Result
                </div>
                <h3 className="text-xl font-bold text-white mb-4">What happened?</h3>
                <p className="text-slate-400 leading-relaxed mb-8">{result.explanation}</p>
                
                <h3 className="text-xl font-bold text-white mb-4">Recommended Solution</h3>
                <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {result.solution}
                </div>
              </div>

              <div className="p-6 md:p-8 bg-slate-900/50">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Generated Config Files
                </h3>
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
        )}

        {status === Status.IDLE && !result && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <p className="text-slate-500 max-w-xs">Enter your deployment error above to generate a smart solution.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-8 mt-12 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} DockerConfig AI. Specialized in DevOps automation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
