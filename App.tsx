
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
      {/* Header */}
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
              { id: TabType.Render, label: "Render'da Yayınla" },
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
            {/* Explain the Flow Section */}
            <section className="mb-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-blue-600">🚀</span> Bu Uygulama Nasıl Kullanılır?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                <div className="relative z-10 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="text-blue-600 font-bold mb-2">1. Adım: Bu Site</div>
                  <p className="text-sm text-slate-600">Şu an buradasınız. Burası sizin <b>"Kontrol Merkeziniz"</b>. Buradaki Dockerfile ve README kodlarını kopyalayacaksınız.</p>
                </div>
                <div className="relative z-10 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="text-blue-600 font-bold mb-2">2. Adım: Hugging Face</div>
                  <p className="text-sm text-slate-600">Hugging Face'de bir <b>Space</b> açıp, bu siteden aldığınız kodları oraya yapıştıracaksınız.</p>
                </div>
                <div className="relative z-10 bg-blue-600 p-5 rounded-2xl text-white shadow-lg">
                  <div className="font-bold mb-2">3. Adım: n8n Çalışıyor!</div>
                  <p className="text-sm text-blue-50">Hugging Face size bir URL verecek. n8n artık orada (16GB RAM ile) çalışıyor olacak!</p>
                </div>
                {/* Connector Line for desktop */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-0"></div>
              </div>
            </section>

            <section className="mb-10 text-center sm:text-left">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Hugging Face'de n8n Kurulumu</h2>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Render'dan daha fazla RAM (16GB) ve daha az kısıtlama. Adım adım kurulum rehberiniz.
              </p>
            </section>
            
            {STEPS.map(step => (
              <StepCard key={step.id} step={step} />
            ))}
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-xl mt-4 shadow-sm">
              <h4 className="text-amber-800 font-bold mb-2 flex items-center gap-2 text-lg">
                ⚠️ Veri Kaybı Riski
              </h4>
              <p className="text-amber-700 text-sm leading-relaxed">
                Hugging Face Spaces "stateless" yapıdadır. Space yeniden başladığında n8n senaryolarınız silinebilir. 
                <strong> Çözüm:</strong> n8n içinden senaryolarınızı düzenli yedekleyin veya Settings kısmından harici bir PostgreSQL (Supabase vb.) bağlayın.
              </p>
            </div>
          </div>
        )}

        {activeTab === TabType.Workflows && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <section className="mb-6">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Hazır n8n Akışları</h2>
              <p className="text-slate-600 italic">Bu JSON kodlarını kopyalayın ve <b>Hugging Face üzerinde çalışan n8n panelinize</b> yapıştırın.</p>
            </section>
            
            {WORKFLOWS.map((workflow, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-800">{workflow.name}</h3>
                    <button 
                      onClick={() => copyToClipboard(workflow.json, `wf-${idx}`)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        copiedWorkflow === `wf-${idx}` ? 'bg-green-100 text-green-700' : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {copiedWorkflow === `wf-${idx}` ? 'Kopyalandı!' : 'JSON Kopyala'}
                    </button>
                  </div>
                  <p className="text-slate-600 mb-6 text-sm">{workflow.description}</p>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <pre className="text-[11px] text-slate-500 overflow-x-auto max-h-48 font-mono">
                      {workflow.json}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === TabType.Resources && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Ortam Değişkenleri (Config)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VARIABLES.map(v => (
                  <div key={v.key} className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="font-mono text-blue-600 text-sm font-bold mb-2">{v.key}</div>
                    <div className="text-xs text-slate-600 mb-3">{v.description}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Örnek</div>
                    <div className="text-xs font-mono text-slate-500 bg-white p-2 rounded mt-1 border border-slate-100">{v.placeholder}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">Hugging Face "Cilveleri"</h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-blue-400 font-bold">01.</span>
                  <p className="text-sm text-slate-300"><strong className="text-white">Uyku Modu:</strong> 48 saat işlem yapılmazsa Space durur. Bir kez girince uyanır.</p>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-400 font-bold">02.</span>
                  <p className="text-sm text-slate-300"><strong className="text-white">Performans:</strong> 16GB RAM ile Python tabanlı işlemler ve büyük otomasyonlar çok daha rahattır.</p>
                </li>
                <li className="flex gap-4">
                  <span className="text-blue-400 font-bold">03.</span>
                  <p className="text-sm text-slate-300"><strong className="text-white">Webhook URL:</strong> Space URL'nizi her zaman sonuna "/" ekleyerek kaydedin.</p>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === TabType.Render && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="mb-10 text-center sm:text-left">
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Render'da "Web Service" Hata Giderme</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Render'da <code>ENOENT: package.json not found</code> hatası alıyorsanız, aşağıdaki kritik adımları kontrol edin.
              </p>
              
              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-2xl mb-8 shadow-sm">
                <h4 className="text-red-800 font-bold mb-3 flex items-center gap-2 text-xl">
                  🚨 ÇÖZÜM: Docker Dosyası Çakışması
                </h4>
                <p className="text-red-700 text-sm leading-relaxed mb-4">
                  Render, projenin kök dizininde bir <code>Dockerfile</code> görürse, <code>package.json</code> dosyasını görmezden gelir ve projeyi bir Docker servisi olarak başlatmaya çalışır.
                </p>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-red-100">
                    <p className="font-bold text-red-800 text-sm mb-1">Ne Yapmalısınız?</p>
                    <p className="text-xs text-red-600">Rehberdeki n8n için olan <code>Dockerfile</code> dosyasını GitHub deponuzun kök dizininden <b>silin</b> veya adını <code>n8n.Dockerfile</code> olarak değiştirin. Render'ın bu dosyayı "görmemesi" gerekiyor.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-red-100">
                    <p className="font-bold text-red-800 text-sm mb-1">Render Ayarlarını Kontrol Edin</p>
                    <p className="text-xs text-red-600">Settings kısmında "Runtime" seçeneğinin <b>Node</b> olduğundan emin olun. Docker seçili kalmış olabilir.</p>
                  </div>
                </div>
              </div>
            </section>
            
            {RENDER_STEPS.map(step => (
              <StepCard key={step.id} step={step} />
            ))}

            <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-lg mt-8">
              <h4 className="font-bold mb-2 flex items-center gap-2">💡 Tavsiye</h4>
              <p className="text-sm text-blue-100">
                Bu uygulama tamamen statik bir React uygulamasıdır. Eğer Node.js sunucusu (Web Service) ile uğraşmak istemiyorsanız, Render'da <b>"New > Static Site"</b> seçeneğini kullanarak sorunsuzca yayınlayabilirsiniz.
              </p>
            </div>
          </div>
        )}

        {activeTab === TabType.AIAssistant && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AIAssistant />
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 py-4 px-6 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span>n8n Deployer Helper</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>Turkish Language Pack</span>
          </div>
          <a href="https://huggingface.co/docs/hub/spaces-config-reference" target="_blank" className="text-[10px] text-blue-500 hover:text-blue-700 font-bold underline">
            HF Docs Reference
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
