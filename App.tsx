
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
            <div className="bg-gradient-to-br from-red-600 to-orange-600 p-2 rounded-xl text-white font-bold text-xl shadow-lg animate-pulse">!</div>
            <div>
              <h1 className="font-bold text-slate-800 tracking-tight leading-tight uppercase">Render Fixer</h1>
              <p className="text-[10px] text-red-500 uppercase font-bold tracking-widest leading-none">Status: Critical Action Required</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {[
              { id: TabType.Render, label: "🚨 RENDER'I KURTAR" },
              { id: TabType.Guide, label: 'HF n8n Kurulumu' },
              { id: TabType.Workflows, label: 'Hazır Akışlar' },
              { id: TabType.AIAssistant, label: 'Yapay Zeka Sor-Cevap' }
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
            {/* PROGRESS UPDATE */}
            <div className="bg-green-600 text-white p-6 rounded-t-[2rem] flex items-center gap-4 border-b border-green-500">
              <div className="bg-white text-green-600 rounded-full p-1 shadow-inner">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </div>
              <p className="font-black text-lg">YOLUN YARISINDASINIZ! Dockerfile Silindi ✅</p>
            </div>

            {/* THE FINAL OBSTACLE */}
            <div className="bg-white border-x-4 border-b-4 border-red-600 rounded-b-[2.5rem] p-10 shadow-2xl mb-12">
              <h2 className="text-3xl font-black mb-6 text-slate-900 leading-tight">
                Şu anki hatanız: <span className="text-red-600">"Dockerfile okunamadı"</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 font-medium">
                Harika! Dosyayı sildiğiniz için Render artık projenin ne olduğunu şaşırdı. 
                Hala "Docker modunda" olduğu için Dockerfile arıyor ama bulamıyor. 
                <b>Şimdi Render'a bunun bir Node.js projesi olduğunu söyleme zamanı:</b>
              </p>
              
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-inner mb-8 ring-8 ring-slate-100">
                <h4 className="text-red-400 font-black text-center text-xl mb-6 uppercase tracking-widest">SON ADIM: RENDER AYARLARINI DEĞİŞTİRİN</h4>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg">1</div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs font-bold uppercase">Runtime Seçimi</p>
                      <p className="font-black text-xl">Settings &gt; Runtime: <span className="text-blue-400 underline decoration-2">Node</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg">2</div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs font-bold uppercase">Yükleme Komutu</p>
                      <p className="font-black text-xl">Build Command: <span className="text-green-400 font-mono">npm install && npm run build</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg">3</div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs font-bold uppercase">Başlatma Komutu</p>
                      <p className="font-black text-xl">Start Command: <span className="text-green-400 font-mono">npm start</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-slate-500 font-bold mb-4 italic">Ayarları kaydedip "Manual Deploy" butonuna bastığınızda siteniz yayına girecek.</p>
                <div className="inline-block bg-red-100 text-red-700 px-6 py-3 rounded-full font-black animate-bounce">
                  ⚠️ DOCKER COMMAND KUTUSUNU TAMAMEN BOŞALTIN!
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg">
                <h4 className="font-black mb-2">Peki neden?</h4>
                <p className="text-sm opacity-90 leading-relaxed">
                  Render projenizi "Docker" olarak mimlemişti. Dockerfile'ı sildiğinizde Render "Ben neyi çalıştıracağım?" diyor. Runtime'ı "Node" olarak değiştirdiğimizde Render artık Dockerfile'ı değil, package.json dosyasını baz alacaktır.
                </p>
              </div>
              <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-lg">
                <h4 className="font-black mb-2">Başardığınızda:</h4>
                <p className="text-sm opacity-90 leading-relaxed">
                  Siteniz yayına girecek ve size n8n'i 16GB RAM ile nasıl bedava kuracağınızı anlatan dev bir rehber sunacak. n8n'i Render'da değil, Hugging Face'de kuracağız.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === TabType.Guide && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="mb-10 text-center sm:text-left">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Hugging Face n8n Kurulumu</h2>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Render'daki sorunu çözdüğünüze göre, şimdi n8n kurulumuna başlayabiliriz.
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
                  <button onClick={() => copyToClipboard(workflow.json, `wf-${idx}`)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-transform active:scale-95">JSON Kopyala</button>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{workflow.description}</p>
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
