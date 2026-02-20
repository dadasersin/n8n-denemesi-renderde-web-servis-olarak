import React, { useState } from 'react';

const ApiHealthCheck: React.FC = () => {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const checkHealth = async () => {
    if (!url || !apiKey) {
      alert('Lütfen n8n URL ve API Key girin.');
      return;
    }

    setStatus('testing');
    try {
      // Clean URL: remove trailing slash
      const cleanUrl = url.replace(/\/$/, '');

      // Note: In a real app, this might hit CORS issues from the browser.
      // But we provide it as a tool/guide.
      const response = await fetch(`${cleanUrl}/api/v1/healthz`, {
        headers: {
          'X-N8N-API-KEY': apiKey
        }
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Bağlantı Başarılı! Sunucunuz aktif ve yanıt veriyor.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStatus('error');
        setMessage(`Bağlantı Hatası: ${response.status} - ${errorData.message || 'Sunucuya ulaşılamıyor.'}`);
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`Hata: ${error.message}. Not: CORS kısıtlamaları nedeniyle tarayıcıdan test başarısız olabilir.`);
    }
  };

  return (
    <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs">API</span>
        n8n Bağlantı Testi
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase">n8n Instance URL</label>
          <input
            type="text"
            placeholder="https://n8n.onrender.com"
            className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase">n8n API Key (JWT)</label>
          <input
            type="password"
            placeholder="eyJhbGciOiJIUzI1Ni..."
            className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <button
          onClick={checkHealth}
          disabled={status === 'testing'}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all"
        >
          {status === 'testing' ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}
        </button>

        {status !== 'idle' && (
          <div className={`mt-4 p-4 rounded-xl text-xs font-medium ${status === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {message}
          </div>
        )}
      </div>
    </section>
  );
};

export default ApiHealthCheck;
