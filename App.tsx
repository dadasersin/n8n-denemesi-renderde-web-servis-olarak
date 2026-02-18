
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
              { id: TabType.Render, label: "⚠️ RENDER HATASINI ÇÖZ" },
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
            {/* Critical Error Alert */}
            <div className="bg-red-600 text-white p-8 rounded-3xl mb-10 shadow-2xl ring-4 ring-red-200">
              <h2 className="text-3xl font-black mb-4 flex items-center gap-2">
                🛑 DUR! HATANIN SEBEBİ BURADA
              </h2>
              <p className="text-xl font-bold mb-6 text-red-100">
                "Invalid tag name &&" hatası alıyorsunuz çünkü Render'ı yanlış modda çalıştırıyorsunuz.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 p-5 rounded-2xl border border-white/20">
                  <h4 className="font-black text-lg mb-2 underline">YANLIŞ OLAN ❌</h4>
                  <ul className="text-sm space-y-2 opacity-90">
                    <li>• GitHub'da <b>Dockerfile</b> dosyasının durması.</li>
                    <li>• Render'da <b>Docker</b> modunun seçili olması.</li>
                    <li>• "Docker Command" kısmına <code>npm...</code> yazmak.</li>
                  </ul>
                </div>
                <div className="bg-green-500 p-5 rounded-2xl border border-green-400 text-white">
                  <h4 className="font-black text-lg mb-2 underline">DOĞRU OLAN ✅</h4>
                  <ul className="text-sm space-y-2 font-bold">
                    <li>• GitHub'dan <b>Dockerfile'ı SİLİN</b>.</li>
                    <li>• Settings > Runtime: <b>Node</b> seçin.</li>
                    <li>• <b>Build Command:</b> <code>npm install && npm run build</code></li>
                    <li>• <b>Start Command:</b> <code>npm start</code></li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-yellow-400 text-black rounded-xl font-black text-center animate-bounce">
                DOCKER KOMUTU KISMINA HİÇBİR ŞEY YAZMAYIN!
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800">Render Web Service Ayarları Tablosu</h3>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                    <tr>
                      <th className="px-6 py-4">Ayar Adı</th>
                      <th className="px-6 py-4">Girilecek Değer</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    <tr>
                      <td className="px-6 py-4 font-bold">Runtime</td>
                      <td className="px-6 py-4 text-blue-600 font-mono">Node</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold">Build Command</td>
                      <td className="px-6 py-4 text-blue-600 font-mono">npm install && npm run build</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold">Start Command</td>
                      <td className="px-6 py-4 text-blue-600 font-mono">npm start</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === TabType.Guide && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="mb-10 text-center sm:text-left">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Hugging Face'de n8n Kurulumu</h2>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Render'da bu hatayı çözdükten sonra, aşağıdaki kodları <b>Hugging Face</b> panelinde kullanacaksınız.
              </p>
            </section>
            {STEPS.map(step => (
              <StepCard key={step.id} step={step} />
            ))}
          </div>
        )}

        {/* Diğer tablar aynı kalacak... */}
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
