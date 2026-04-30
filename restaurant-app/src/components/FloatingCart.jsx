import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export default function FloatingCart({ count, total, onClick }) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden animate-slide-up">
      <button
        onClick={onClick}
        className="flex items-center gap-3 bg-brand-500 hover:bg-brand-400 text-white pl-4 pr-5 py-3.5 rounded-2xl shadow-2xl shadow-brand-500/30 transition-all duration-200 active:scale-95"
      >
        <div className="relative">
          <ShoppingBag size={20} />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-brand-600 text-[10px] font-bold rounded-full flex items-center justify-center">
            {count}
          </span>
        </div>
        <span className="font-semibold">View Cart</span>
        <span className="bg-brand-600/50 rounded-xl px-2 py-0.5 text-sm font-bold">
          {formatCurrency(total)}
        </span>
      </button>
    </div>
  );
}
