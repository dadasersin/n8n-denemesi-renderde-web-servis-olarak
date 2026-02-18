
import React, { useState } from 'react';
import { TabType } from './types';
import { STEPS, VARIABLES, WORKFLOWS, RENDER_STEPS } from './constants';
import { StepCard } from './components/StepCard';
import { AIAssistant } from './components/AIAssistant';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Guide);
  const [copiedWorkflow, setCopiedWorkflow] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWorkflow(id);
    setTimeout(() => setCopiedWorkflow(null), 2000);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl text-white font-bold text-xl shadow-lg">n8n</div>
            <div>
              <h1 className="font-bold text-slate-800 tracking-tight leading-tight">HF Deployer</h1>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Automation Hub</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {[
              { id: TabType.Guide, label: 'Kurulum' },
              { id: TabType.Workflows, label: 'Akışlar' },
              { id: TabType.Resources, label: 'Kaynaklar' },
              { id: TabType.Render, label: "Render Hata Çözümü" },
              { id: TabType.AIAssistant, label: 'Asistan' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12">
        {activeTab === TabType.Guide && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="mb-10 text-center sm:text-left">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Hugging Face'de n8n Kurulumu</h2>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                16GB RAM ile profesyonel n8n kurulumu için gereken tüm kodlar burada.
              </p>
            </section>
            {STEPS.map(step => (
              <StepCard key={step.id} step={step} />
            ))}
          </div>
        )}

        {activeTab === TabType.Render && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-red-600 text-white p-8 rounded-3xl mb-10 shadow-xl">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                🛑 DİKKAT: "package.json okunamadı" Hatası
              </h2>
              <p className="mb-6 opacity-90 leading-relaxed">
                Render panelinde <b>"Docker Komutu"</b> görüyorsanız yanlış yerdesiniz. Render, ana dizindeki Dockerfile'ı görüp projeyi yanlış modda başlatıyor.
              </p>
              <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                <p className="font-bold mb-2">Çözüm İçin Şunları Yapın:</p>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>GitHub'daki <b>Dockerfile</b> dosyasını silin. (Onu sadece Hugging Face'de kullanacaksınız!)</li>
                  <li>Render Settings > Runtime kısmını <b>Node</b> yapın.</li>
                  <li>Build Command kısmına <code>npm install && npm run build</code> yazın.</li>
                  <li>Start Command kısmına <code>npm start</code> yazın.</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-6 text-slate-800">Adım Adım Render Web Service Kurulumu</h3>
            {RENDER_STEPS.map(step => (
              <StepCard key={step.id} step={step} />
            ))}
          </div>
        )}

        {activeTab === TabType.Workflows && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            {WORKFLOWS.map((workflow, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{workflow.name}</h3>
                  <button 
                    onClick={() => copyToClipboard(workflow.json, `wf-${idx}`)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    JSON Kopyala
                  </button>
                </div>
                <p className="text-slate-600 text-sm">{workflow.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === TabType.Resources && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Önemli Ayarlar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VARIABLES.map(v => (
                  <div key={v.key} className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="font-mono text-blue-600 text-sm font-bold mb-2">{v.key}</div>
                    <div className="text-xs text-slate-600">{v.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === TabType.AIAssistant && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AIAssistant />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
