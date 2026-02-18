
import React, { useState } from 'react';
import { TabType } from './types';
import { STEPS, VARIABLES, WORKFLOWS, RENDER_STEPS } from './constants';
import { StepCard } from './components/StepCard';
import { AIAssistant } from './components/AIAssistant';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Render);
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
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl text-white font-bold text-xl shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
              <h1 className="font-bold text-slate-800 tracking-tight leading-tight uppercase">n8n Docker Guide</h1>
              <p className="text-[10px] text-blue-500 uppercase font-bold tracking-widest leading-none">Status: Docker Mode Active</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {[
              { id: TabType.Render, label: "🐳 RENDER DOCKER AYARI" },
              { id: TabType.Guide, label: 'HF n8n Kurulumu' },
              { id: TabType.Workflows, label: 'Hazır Akışlar' },
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
        {activeTab === TabType.Render && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-700 text-white p-10 rounded-[2.5rem] mb-12 shadow-2xl border-4 border-blue-400">
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                🐳 DOCKER İLE ÇALIŞTIRMA REHBERİ
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Render'da "Docker" seçtiyseniz, hata almamak için <b>paneldeki komut kutularını boş bırakmalısınız.</b> 
                Çünkü her şey <code>Dockerfile</code> içinde tanımlıdır.
              </p>

              <div className="bg-white rounded-3xl p-8 text-slate-900 shadow-xl space-y-6">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-black text-red-600 uppercase text-sm tracking-wider">KRİTİK HATA ÖNLEYİCİ</h4>
                  <p className="text-sm font-medium">
                    Render panelinde <b>"Docker Command"</b> kutusuna hiçbir şey yazmayın. 
                    Oraya <code>npm install && ...</code> yazarsanız Render bunu "etiket ismi" sanıp <b>EINVALIDTAGNAME</b> hatası verir.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Render Settings > Environment</p>
                    <p className="font-mono text-sm">Runtime: <b>Docker</b></p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Render Settings > Docker Command</p>
                    <p className="font-mono text-sm text-red-600 font-black tracking-widest">--- BOŞ BIRAKIN ---</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-500 rounded-2xl text-center font-bold">
                Dockerfile dosyasını GitHub'a ekledim. Şimdi "Manual Deploy" yapabilirsiniz.
              </div>
            </div>
          </div>
        )}

        {activeTab === TabType.Guide && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="mb-10 text-center sm:text-left">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Hugging Face n8n Kurulumu</h2>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Bu uygulama çalıştıktan sonra asıl hedefimiz olan n8n'i Hugging Face'de kurmak için aşağıdaki adımları izleyin.
              </p>
            </section>
            {STEPS.map(step => (
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
                  <button onClick={() => copyToClipboard(workflow.json, `wf-${idx}`)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">JSON Kopyala</button>
                </div>
                <p className="text-slate-600 text-sm">{workflow.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === TabType.AIAssistant && <AIAssistant />}
      </main>
    </div>
  );
};

export default App;
