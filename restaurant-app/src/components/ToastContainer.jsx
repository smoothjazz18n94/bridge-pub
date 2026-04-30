import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={16} className="text-green-400" />,
  error: <AlertCircle size={16} className="text-red-400" />,
  info: <Info size={16} className="text-blue-400" />,
};

const BG = {
  success: 'bg-green-500/10 border-green-500/20',
  error: 'bg-red-500/10 border-red-500/20',
  info: 'bg-blue-500/10 border-blue-500/20',
};

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 items-center pointer-events-none w-full max-w-sm px-4">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-xl animate-slide-up pointer-events-auto ${BG[toast.type] || BG.info}`}
        >
          {ICONS[toast.type] || ICONS.info}
          <span className="text-white text-sm font-medium flex-1">{toast.message}</span>
          <button onClick={() => onRemove(toast.id)} className="text-white/30 hover:text-white/70 transition-colors">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
