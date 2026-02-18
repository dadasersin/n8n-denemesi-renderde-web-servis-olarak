
import React, { useState } from 'react';
import { TabType } from './types';
import { STEPS, VARIABLES, WORKFLOWS, RENDER_STEPS } from './constants';
import { StepCard } from './components/StepCard';
import { AIAssistant } from './components/AIAssistant';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Render);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const dockerfileContent = `FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV PORT=10000
EXPOSE 10000
CMD ["node", "server.js"]`;

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl text-white font-bold text-xl shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
              <h1 className="font-bold text-slate-800 tracking-tight leading-tight uppercase">Docker Deployer</h1>
              <p className="text-[10px] text-blue-500 uppercase font-bold tracking-widest leading-none">Target: Render Fix & n8n</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {[
              { id: TabType.Render, label: "🐳 DOCKER HATASINI ÇÖZ" },
              { id: TabType.Guide, label: 'HF n8n Kurulumu' },
              { id: TabType.Workflows, label: 'Akışlar' },
              { id: TabType.AIAssistant, label: 'AI Asistan' }
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
            <div className="bg-white border-2 border-red-200 rounded-[2.5rem] overflow-hidden shadow-2xl mb-12">
              <div className="bg-red-600 p-8 text-white">
                <h2 className="text-3xl font-black mb-2 flex items-center gap-3 text-white">
                  🚨 HATA: "file with no instructions"
                </h2>
                <p className="opacity-90 font-medium leading-relaxed">
                  Render şu an deponuzdaki Dockerfile'ı okuyor ama içinde <b>"hiçbir talimat yok"</b> diyor. 
                  Bunun sebebi dosya içine yanlışlıkla <code>>>></code> gibi geçersiz karakterler girmesidir.
                </p>
              </div>

              <div className="p-8 space-y-8">
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h3 className="font-black text-blue-800 mb-4 flex items-center gap-2">
                    ✅ Çözüm: Dosyayı Aşağıdakiyle Güncelleyin
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    GitHub deponuzdaki <b>Dockerfile</b> dosyasını açın (Edit mode), içindeki her şeyi silin ve sadece aşağıdaki kodu yapıştırın:
                  </p>
                  
                  <div className="relative group">
                    <button 
                      onClick={() => copyToClipboard(dockerfileContent, 'dockerfile-code')}
                      className="absolute right-4 top-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
                    >
                      {copiedId === 'dockerfile-code' ? 'Kopyalandı!' : 'Kodu Kopyala'}
                    </button>
                    <pre className="bg-slate-900 text-slate-300 p-6 rounded-2xl text-sm overflow-x-auto leading-relaxed border-b-4 border-slate-700">
{dockerfileContent}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2">⚠️ Bunları Kontrol Edin:</h4>
                    <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                      <li>Dosya adının sonunda <code>.txt</code> veya <code>.docker</code> olmadığından emin olun. Sadece <b>Dockerfile</b>.</li>
                      <li>Kopyalarken terminaldeki <code>>>></code> veya satır numaralarını dahil etmeyin.</li>
                      <li>Dosyanın en başında hiçbir boşluk veya gizli karakter olmamalı.</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2">⚙️ Render Paneli:</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Render'da Settings sekmesine gidin. <br/>
                      <b>Docker Command</b> kutusu tamamen <b>BOŞ</b> olmalıdır. 
                      Eğer orada bir şey yazıyorsa, Render hata verip durur.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 p-6 text-center">
                <p className="text-blue-400 font-bold text-sm underline decoration-blue-500/30">
                  GitHub'da dosyayı güncelledikten sonra Render'da "Manual Deploy > Clear Cache & Deploy" butonuna basın. ✅
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
                Hugging Face üzerinde 16GB RAM ile profesyonel n8n kurulumu için rehberi takip edin.
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
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{workflow.name}</h3>
                  <button 
                    onClick={() => copyToClipboard(workflow.json, `wf-${idx}`)} 
                    className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                  >
                    {copiedId === `wf-${idx}` ? 'Kopyalandı!' : 'JSON Kopyala'}
                  </button>
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
