
import React, { useState } from 'react';
import { Step } from '../types';

interface StepCardProps {
  step: Step;
}

export const StepCard: React.FC<StepCardProps> = ({ step }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (step.code) {
      navigator.clipboard.writeText(step.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 transition-all hover:shadow-md">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
            {step.id}
          </span>
          <h3 className="text-xl font-semibold text-slate-800">{step.title}</h3>
        </div>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          {step.description}
        </p>

        {step.code && (
          <div className="relative group">
            <div className="absolute right-3 top-3">
              <button 
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  copied 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {copied ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-blue-300 overflow-x-auto">
              <pre><code>{step.code}</code></pre>
            </div>
            {step.fileName && (
              <div className="mt-2 text-xs text-slate-400 italic">
                Dosya Adı: <span className="font-mono text-slate-600">{step.fileName}</span>
              </div>
            )}
          </div>
        )}

        {step.tips && step.tips.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">İpuçları:</h4>
            <ul className="list-disc list-inside text-sm text-slate-500 space-y-1">
              {step.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
