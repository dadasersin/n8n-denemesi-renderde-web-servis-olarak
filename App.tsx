
import React, { useState } from 'react';
import { TabType } from './types';
import { STEPS, VARIABLES, WORKFLOWS, RENDER_STEPS } from './constants';
import { StepCard } from './components/StepCard';
import { AIAssistant } from './components/AIAssistant';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Render); // Hata çözümü için varsayılan sekme yapıldı
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
            <div className="bg-gradient-to-br from-red-600 to-orange-600 p-2 rounded-xl text-white font-bold text-xl shadow-lg animate-pulse">!</div>
            <div>
              <h1 className="font-bold text-slate-800 tracking-tight leading-tight uppercase">Acil Çözüm Merkezi</h1>
              <p className="text-[10px] text-red-500 uppercase font-bold tracking-widest">Render Hatası Giderme</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {[
              { id: TabType.Render, label: "⚠️ RENDER'I DÜZELT" },
              { id: TabType.Guide, label: 'HF n8n Kurulumu' },
              { id: TabType.Workflows, label: 'Akışlar' },
              { id: TabType.AIAssistant, label: 'Asistan' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id 
                  ? 'bg-red-600 text-white shadow-md' 
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
            {/* HATA ANALİZİ PANELİ */}
            <div className="bg-red-700 text-white p-10 rounded-[2.5rem] mb-12 shadow-2xl border-4 border-red-400">
              <h2 className="text-4xl font-black mb-6 flex items-center gap-3">
                🛑 HATANIZIN %100 ÇÖZÜMÜ
              </h2>
              <div className="space-y-6 text-lg">
                <p className="font-bold bg-white/20 p-4 rounded-xl">
                  Loglarınızdaki <code className="bg-black px-2">EINVALIDTAGNAME "&&"</code> hatası, Render'ın projenizi yanlışlıkla "Docker" olarak kurmaya çalışmasından kaynaklanıyor.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="bg-white p-6 rounded-2xl text-slate-900 shadow-xl">
                    <h4 className="font-black text-red-600 text-xl mb-4 border-b-2 border-red-100 pb-2">ADIM 1: GITHUB</h4>
                    <p className="text-sm font-semibold mb-4 text-slate-600 uppercase tracking-tighter">Hemen Yapın:</p>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="font-black text-red-700">Dockerfile DOSYASINI SİLİN!</p>
                      <p className="text-xs text-red-600 mt-2 italic">Not: Bu dosya sadece Hugging Face içindir. Render'daki GitHub deponuzda ASLA olmamalıdır.</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl text-slate-900 shadow-xl">
                    <h4 className="font-black text-blue-600 text-xl mb-4 border-b-2 border-blue-100 pb-2">ADIM 2: RENDER AYARI</h4>
                    <p className="text-sm font-semibold mb-4 text-slate-600 uppercase tracking-tighter">Settings sekmesinde:</p>
                    <ul className="text-sm space-y-3 font-bold">
                      <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Runtime: <span className="text-blue-600">Node</span></li>
                      <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Build: <span className="text-blue-600">npm install && npm run build</span></li>
                      <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Start: <span className="text-blue-600">npm start</span></li>
                      <li className="flex items-center gap-2 text-red-600"><span className="text-red-500">✘</span> Docker Command: <span className="bg-slate-100 px-2">BOŞ BIRAKIN</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-10 bg-yellow-400 text-black p-6 rounded-2xl text-center font-black text-xl shadow-lg transform -rotate-1">
                BU İKİ ADIMI YAPTIĞINIZDA SİTE AÇILACAKTIR!
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="text-2xl font-black mb-6 text-slate-800">Neden Hata Alıyorsunuz?</h3>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p>
                  Render, projenin kök dizininde bir <code>Dockerfile</code> gördüğü an otomatik olarak <b>Docker Runtime</b>'a geçer. 
                  Docker modunda "Build Command" diye bir şey yoktur, sadece "Docker Command" vardır. Siz oraya Terminal komutu yazınca 
                  Render bunu Docker imajı sanıp hata verir. 
                </p>
                <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500 mt-4">
                  <b>Unutmayın:</b> Bu site bir <u>Rehberdir</u>. Önce bu siteyi kurun, sonra bu sitenin içindeki kodları kopyalayıp <u>Hugging Face'de</u> n8n kuracaksınız.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === TabType.Guide && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="mb-10 text-center sm:text-left">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Hugging Face n8n Kurulumu</h2>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Render'daki sorunu çözüp bu rehberi açtıktan sonra, aşağıdaki adımlarla 16GB RAM'li n8n'inizi kurun.
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
