import React, { useState } from 'react';
import { analyzeN8nLogs } from './services/geminiService';
import { AnalysisResult, DiagnosticStatus } from './types';

const App: React.FC = () => {
  const [logs, setLogs] = useState('');
  const [status, setStatus] = useState<DiagnosticStatus>(DiagnosticStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setError("An error occurred during analysis. Check if your API key is valid or if the logs are readable.");
      setStatus(DiagnosticStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            n8n Render Troubleshooter
          </h1>
          <p className="mt-2 opacity-90 text-lg">Fix "Lost connection to the server" and deployment crashes using AI-powered log analysis.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {/* Quick Tips Section */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-900">Why does n8n crash on Render?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-bold text-blue-800 flex items-center gap-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Memory (RAM)
              </h3>
              <p className="text-sm text-blue-700 mt-1">Render's Free plan has 512MB. n8n with many nodes or heavy processing easily hits this and gets OOM killed (SIGKILL).</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h3 className="font-bold text-amber-800 flex items-center gap-2">
                <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                SQLite Locking
              </h3>
              <p className="text-sm text-amber-700 mt-1">On network drives or when multiple instances run, SQLite often throws "database is locked" errors, crashing the process.</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                <span className="bg-emerald-200 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Start Command
              </h3>
              <p className="text-sm text-emerald-700 mt-1">Errors like "ENOENT: package.json" mean Render is trying to run npm. Clear the Start Command field or set it to "n8n start".</p>
            </div>
          </div>
        </section>

        {/* Log Input Section */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-indigo-900">Paste your Render Logs</h2>
            <p className="text-slate-500 text-sm mb-4 italic">Paste the text from your Render 'Logs' tab to identify the exact cause.</p>
            <textarea
              className="w-full h-48 p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none border-none resize-none"
              placeholder="Example: [n8n] Error: database is locked..."
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={status === DiagnosticStatus.ANALYZING || !logs.trim()}
              className={`mt-4 w-full py-3 px-6 rounded-lg font-bold text-white transition-all shadow-md ${
                status === DiagnosticStatus.ANALYZING
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:transform active:scale-[0.99]'
              }`}
            >
              {status === DiagnosticStatus.ANALYZING ? 'Analyzing with Gemini...' : 'Analyze Deployment Logs'}
            </button>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {status === DiagnosticStatus.SUCCESS && result && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-12">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-emerald-900 mb-2">Diagnosis</h2>
              <p className="text-emerald-800 text-lg leading-relaxed">{result.diagnosis}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-wider text-xs">Probable Causes</h3>
                <ul className="space-y-3">
                  {result.probableCauses.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-wider text-xs">Recommended Action Plan</h3>
                <div className="space-y-6">
                  {result.suggestedFixes.map((fix, idx) => (
                    <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                      <h4 className="font-bold text-indigo-900 mb-1">{fix.title}</h4>
                      <p className="text-sm text-slate-600 mb-3">{fix.description}</p>
                      {fix.code && (
                        <div className="relative group">
                          <pre className="bg-slate-900 text-slate-300 p-3 rounded text-xs font-mono overflow-x-auto">
                            <code>{fix.code}</code>
                          </pre>
                          <button
                            className="absolute top-2 right-2 text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              navigator.clipboard.writeText(fix.code || '');
                              alert('Copied to clipboard!');
                            }}
                          >
                            Copy
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
      </main>

      {/* Footer info */}
      <footer className="bg-slate-100 py-12 px-4 border-t border-slate-200 text-center text-slate-500 text-sm">
        <div className="max-w-4xl mx-auto">
          <p>© 2024 n8n Performance & Reliability Assistant powered by Gemini 3 Flash.</p>
          <p className="mt-1">For help with Docker, memory limits, and persistent volumes on Render.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
