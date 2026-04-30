import React, { useState } from 'react';
import { X, Copy, Check, Smartphone, MessageCircle, User, Phone } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menu';
import { copyToClipboard, openWhatsApp, formatCurrency } from '../utils/helpers';

export default function PaymentModal({ total, deliveryInfo, cartItems, customer, onClose, onToast, onComplete }) {
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);

  const grandTotal = deliveryInfo?.type === 'delivery' && deliveryInfo?.fee
    ? total + deliveryInfo.fee
    : total;

  const handleCopy = async () => {
    await copyToClipboard(RESTAURANT_INFO.momo.number);
    setCopied(true);
    onToast('MoMo number copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaid = () => {
    setPaid(true);
    const orderSummary = cartItems.map(i => `${i.name} ×${i.quantity}`).join(', ');
    const customerLine = customer?.name ? `\n👤 *Name:* ${customer.name}${customer.phone ? `\n📞 *Phone:* ${customer.phone}` : ''}` : '';
    const msg = `✅ *Payment Confirmation — Bridge Pub*\n${customerLine}\n\nI have paid *${formatCurrency(grandTotal)}* via ${RESTAURANT_INFO.momo.network} to ${RESTAURANT_INFO.momo.number}.\n\nOrder: ${orderSummary}\n\nPlease confirm receipt. Thank you! 🙏`;
    openWhatsApp(msg);
    setTimeout(() => {
      onComplete();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-dark-800 rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl animate-slide-up sm:animate-scale-in">
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="font-display font-bold text-white text-xl">Payment</h2>
          <button onClick={onClose} className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center">
            <X size={16} className="text-white/70" />
          </button>
        </div>

        <div className="px-5 py-6 space-y-5">
          {/* Customer recap */}
          {customer?.name && (
            <div className="flex items-center gap-3 bg-dark-700 rounded-2xl px-4 py-3">
              <div className="w-8 h-8 bg-brand-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-brand-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">{customer.name}</p>
                {customer.phone && <p className="text-white/40 text-xs">{customer.phone}</p>}
                {customer.note && <p className="text-white/40 text-xs italic mt-0.5">"{customer.note}"</p>}
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="text-center py-2">
            <p className="text-white/50 text-sm mb-1">Amount to Pay</p>
            <p className="font-display text-5xl font-bold text-white">{formatCurrency(grandTotal)}</p>
            {deliveryInfo?.fee && (
              <p className="text-white/30 text-xs mt-2">Includes {formatCurrency(deliveryInfo.fee)} delivery fee</p>
            )}
          </div>

          {/* MoMo Card */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border border-yellow-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Smartphone size={15} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{RESTAURANT_INFO.momo.network}</p>
                <p className="text-white/40 text-xs">Mobile Money Payment</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between bg-dark-800/60 rounded-xl px-4 py-3">
                <div>
                  <p className="text-white/40 text-[11px] uppercase tracking-wider mb-0.5">Number</p>
                  <p className="text-white font-semibold text-base tracking-widest">{RESTAURANT_INFO.momo.number}</p>
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    copied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="bg-dark-800/60 rounded-xl px-4 py-3">
                <p className="text-white/40 text-[11px] uppercase tracking-wider mb-0.5">Account Name</p>
                <p className="text-white font-medium text-sm">{RESTAURANT_INFO.momo.name}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2 text-sm text-white/50">
            <p className="flex items-start gap-2"><span className="text-brand-400 font-bold">1.</span> Open your MoMo app and send {formatCurrency(grandTotal)}</p>
            <p className="flex items-start gap-2"><span className="text-brand-400 font-bold">2.</span> Use the number above as the recipient</p>
            <p className="flex items-start gap-2"><span className="text-brand-400 font-bold">3.</span> Tap "I have paid" to confirm via WhatsApp</p>
          </div>

          {/* Paid button */}
          <button
            onClick={handlePaid}
            disabled={paid}
            className={`w-full flex items-center justify-center gap-2.5 font-semibold py-4 rounded-2xl transition-all duration-300 ${
              paid
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-green-500 hover:bg-green-400 text-white shadow-xl shadow-green-500/20 active:scale-98'
            }`}
          >
            {paid ? (
              <><Check size={18} /> Confirmed! Opening WhatsApp…</>
            ) : (
              <><MessageCircle size={18} /> I Have Paid — Confirm on WhatsApp</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
