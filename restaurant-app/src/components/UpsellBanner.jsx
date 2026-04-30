import React, { useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { UPSELL_PAIRS, MENU_ITEMS, CATEGORIES } from '../data/menu';
import { formatCurrency } from '../utils/helpers';

export default function UpsellBanner({ category, onAddToCart, onToast }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const upsell = UPSELL_PAIRS[category];
  if (!upsell) return null;

  const suggestions = MENU_ITEMS.filter(i => i.category === upsell.category && i.popular).slice(0, 2);
  if (!suggestions.length) return null;

  const catLabel = CATEGORIES.find(c => c.id === upsell.category)?.label;

  return (
    <div className="mt-8 relative bg-gradient-to-r from-brand-500/10 to-amber-500/5 border border-brand-500/20 rounded-2xl p-5 animate-fade-in">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-white/30 hover:text-white/60 transition-colors text-lg leading-none"
      >×</button>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-brand-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles size={14} className="text-brand-400" />
        </div>
        <div>
          <p className="text-white font-medium text-sm">{upsell.message}</p>
          <p className="text-white/40 text-xs mt-0.5">Top picks from {catLabel}</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {suggestions.map(item => (
          <div key={item.id} className="flex items-center gap-3 bg-dark-800/60 border border-white/5 rounded-xl p-3 flex-shrink-0 min-w-[220px]">
            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{item.name}</p>
              <p className="text-brand-400 text-xs">{formatCurrency(item.price)}</p>
            </div>
            <button
              onClick={() => {
                onAddToCart(item);
                onToast(`${item.name} added!`, 'success');
              }}
              className="w-7 h-7 bg-brand-500 hover:bg-brand-400 rounded-lg flex items-center justify-center transition-all active:scale-90"
            >
              <Plus size={14} className="text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
