import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export default function CartModal({ items, total, onClose, onUpdateQuantity, onRemove, onCheckout }) {
  const [removing, setRemoving] = useState(null);

  const handleRemove = (id) => {
    setRemoving(id);
    setTimeout(() => {
      onRemove(id);
      setRemoving(null);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-dark-800 rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl animate-slide-up sm:animate-scale-in max-h-[85vh] flex flex-col">
        {/* Handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-500/20 rounded-xl flex items-center justify-center">
              <ShoppingBag size={16} className="text-brand-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">Your Cart</h2>
              <p className="text-white/40 text-xs">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors">
            <X size={16} className="text-white/70" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-white/20" />
              </div>
              <p className="text-white/50 font-medium">Your cart is empty</p>
              <p className="text-white/25 text-sm mt-1">Add items from the menu to get started</p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className={`flex items-center gap-3 bg-dark-700 rounded-2xl p-3 transition-all duration-250 ${
                  removing === item.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{item.name}</p>
                  <p className="text-brand-400 text-sm font-semibold">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => item.quantity === 1 ? handleRemove(item.id) : onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                  >
                    {item.quantity === 1 ? <Trash2 size={12} className="text-red-400" /> : <Minus size={12} className="text-white/70" />}
                  </button>
                  <span className="w-7 text-center text-white font-semibold text-sm">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 bg-brand-500/20 hover:bg-brand-500/30 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Plus size={12} className="text-brand-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-sm">Subtotal</span>
              <span className="text-white font-bold text-lg">{formatCurrency(total)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-brand-500/20 active:scale-98"
            >
              Proceed to Checkout
              <ChevronRight size={16} />
            </button>
            <p className="text-center text-white/25 text-xs mt-3">Delivery fee calculated at checkout</p>
          </div>
        )}
      </div>
    </div>
  );
}
