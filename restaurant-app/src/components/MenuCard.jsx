import React, { useState } from 'react';
import { Plus, Eye, MessageCircle } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { RESTAURANT_INFO } from '../data/menu';

const BADGE_STYLES = {
  "Best Seller":    "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Fan Favourite":  "bg-brand-500/20 text-brand-300 border-brand-500/30",
  "Local Fave":     "bg-green-500/20 text-green-300 border-green-500/30",
  "Traditional":    "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "House Made":     "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "New":            "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Street Classic": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Comfort Pick":   "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "Vegetarian":     "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

export default function MenuCard({ item, onAddToCart, onImageClick, onToast }) {
  const [adding, setAdding] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    onAddToCart(item);
    setAdding(true);
    onToast(`${item.name} added to cart`, 'success');
    setTimeout(() => setAdding(false), 600);
  };

  const handleQuickWhatsApp = () => {
    setShowOrderForm(true);
  };

  const handleSendWhatsApp = () => {
    const name = customerName.trim();
    const phone = customerPhone.trim();
    if (!name) {
      onToast('Please enter your name', 'error');
      return;
    }
    const lineTotal = item.price * qty;
    const msg =
      `🍽️ *Order — Bridge Pub*\n\n` +
      `👤 *Customer:* ${name}${phone ? `\n📞 *Phone:* ${phone}` : ''}\n\n` +
      `• ${item.name} ×${qty} — ${formatCurrency(lineTotal)}\n\n` +
      `*Total: ${formatCurrency(lineTotal)}*\n\nPlease confirm my order. Thank you!`;
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setShowOrderForm(false);
    setCustomerName('');
    setCustomerPhone('');
    setQty(1);
    onToast('Opening WhatsApp…', 'success');
  };

  const badgeStyle = item.badge ? BADGE_STYLES[item.badge] || "bg-white/10 text-white/70 border-white/20" : null;

  return (
    <div className="group relative bg-dark-800 rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:-translate-y-1 card-glow">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
          onClick={() => onImageClick(item)}
          loading="lazy"
        />
        {/* Hover eye overlay */}
        <div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
          onClick={() => onImageClick(item)}
        >
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100">
            <Eye size={18} className="text-white" />
          </div>
        </div>

        {/* Badge */}
        {item.badge && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${badgeStyle}`}>
            {item.badge}
          </div>
        )}

        {/* Popular dot */}
        {item.popular && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-dark-900/70 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-white/70 font-medium">Popular</span>
          </div>
        )}
      </div>

      {/* WhatsApp quick order — sits right below the image */}
      <button
        onClick={handleQuickWhatsApp}
        className="w-full flex items-center justify-center gap-2 bg-green-600/90 hover:bg-green-500 text-white text-xs font-semibold py-2 transition-all duration-200 active:scale-98"
      >
        <MessageCircle size={13} />
        Order via WhatsApp
      </button>

      {/* Inline order form (slides open below the WA button) */}
      {showOrderForm && (
        <div className="px-4 pt-3 pb-2 bg-dark-700/80 border-b border-white/5 animate-slide-down space-y-2">
          <p className="text-white/60 text-[11px] uppercase tracking-wider font-semibold mb-1">Your details</p>
          <input
            type="text"
            placeholder="Your name *"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className="w-full bg-dark-800 border border-white/10 text-white placeholder-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
          />
          <input
            type="tel"
            placeholder="Phone number (optional)"
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            className="w-full bg-dark-800 border border-white/10 text-white placeholder-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
          />
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-xs">Qty:</span>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-6 h-6 bg-white/10 rounded-lg text-white text-sm flex items-center justify-center hover:bg-white/20">−</button>
            <span className="text-white font-semibold text-sm w-5 text-center">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="w-6 h-6 bg-white/10 rounded-lg text-white text-sm flex items-center justify-center hover:bg-white/20">+</button>
            <span className="ml-auto text-brand-400 font-bold text-sm">{formatCurrency(item.price * qty)}</span>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => { setShowOrderForm(false); setCustomerName(''); setCustomerPhone(''); setQty(1); }}
              className="flex-1 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white/60 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-green-500 hover:bg-green-400 text-white transition-all flex items-center justify-center gap-1.5"
            >
              <MessageCircle size={12} />
              Send Order
            </button>
          </div>
        </div>
      )}

      {/* Card content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display font-semibold text-white text-base leading-tight">{item.name}</h3>
          <span className="font-semibold text-brand-400 text-sm whitespace-nowrap mt-0.5">{formatCurrency(item.price)}</span>
        </div>
        <p className="text-white/50 text-xs leading-relaxed mb-4 line-clamp-2">{item.description}</p>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
            adding
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/20'
          }`}
        >
          <Plus size={14} className={`transition-transform duration-200 ${adding ? 'rotate-45' : ''}`} />
          {adding ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
