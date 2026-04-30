import React, { useState } from 'react';
import { X, MapPin, Navigation, Clock, Package, Loader, ChevronRight, AlertCircle, User, Phone, MessageSquare } from 'lucide-react';
import { formatCurrency, calculateDistance, calculateDeliveryFee, estimateDeliveryTime, formatWhatsAppOrder, openWhatsApp } from '../utils/helpers';
import { RESTAURANT_INFO } from '../data/menu';

export default function CheckoutModal({ items, total, onClose, onPayment, onToast }) {
  const [step, setStep] = useState('details'); // 'details' | 'delivery'
  const [customer, setCustomer] = useState({ name: '', phone: '', note: '' });
  const [mode, setMode] = useState(null);
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState(null);
  const [manualAddress, setManualAddress] = useState('');
  const [locError, setLocError] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [estTime, setEstTime] = useState(null);
  const [distance, setDistance] = useState(null);

  const detectLocation = () => {
    setLocating(true);
    setLocError('');
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported by your browser.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = calculateDistance(latitude, longitude, RESTAURANT_INFO.lat, RESTAURANT_INFO.lng);
        setLocation({ lat: latitude, lng: longitude });
        setDistance(dist);
        setDeliveryFee(calculateDeliveryFee(dist));
        setEstTime(estimateDeliveryTime(dist));
        setLocating(false);
        onToast('Location detected!', 'success');
      },
      () => {
        setLocError('Could not detect location. Please enter your address manually.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleManualAddress = (val) => {
    setManualAddress(val);
    if (val.length > 5) {
      const simDist = 3 + (val.length % 8);
      setDistance(simDist);
      setDeliveryFee(calculateDeliveryFee(simDist));
      setEstTime(estimateDeliveryTime(simDist));
    }
  };

  const handlePlaceOrder = () => {
    const deliveryInfo = mode === 'delivery'
      ? { type: 'delivery', address: manualAddress || `${location?.lat?.toFixed(4)}, ${location?.lng?.toFixed(4)}`, fee: deliveryFee }
      : { type: 'pickup' };

    const message = formatWhatsAppOrder(items, deliveryInfo, total, customer);
    openWhatsApp(message);
    onPayment(deliveryInfo, customer);
  };

  const grandTotal = mode === 'delivery' && deliveryFee ? total + deliveryFee : total;
  const detailsValid = customer.name.trim().length > 0;
  const deliveryReady = mode === 'pickup' || (mode === 'delivery' && (location || manualAddress.length > 3));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-dark-800 rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl animate-slide-up sm:animate-scale-in max-h-[90vh] flex flex-col">
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <h2 className="font-display font-bold text-white text-xl">Checkout</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${step === 'details' ? 'bg-brand-500/30 text-brand-300' : 'bg-white/5 text-white/30'}`}>1. Your Details</span>
              <span className="text-white/20 text-xs">›</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${step === 'delivery' ? 'bg-brand-500/30 text-brand-300' : 'bg-white/5 text-white/30'}`}>2. Delivery</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center">
            <X size={16} className="text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* STEP 1: Customer Details */}
          {step === 'details' && (
            <div className="space-y-4 animate-fade-in">
              {/* Order summary mini */}
              <div className="bg-dark-700 rounded-2xl p-4">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Order Summary</p>
                <div className="space-y-1.5 max-h-28 overflow-y-auto no-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/70">{item.name} <span className="text-white/30">×{item.quantity}</span></span>
                      <span className="text-white">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/5 mt-2 pt-2 flex justify-between">
                  <span className="text-white/50 text-sm">Subtotal</span>
                  <span className="text-white font-bold">{formatCurrency(total)}</span>
                </div>
              </div>

              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Your Details</p>
                <div className="space-y-3">
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      placeholder="Your full name *"
                      value={customer.name}
                      onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-dark-700 border border-white/10 text-white placeholder-white/30 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="tel"
                      placeholder="Phone number (optional)"
                      value={customer.phone}
                      onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))}
                      className="w-full bg-dark-700 border border-white/10 text-white placeholder-white/30 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-white/30" />
                    <textarea
                      placeholder="Special requests or notes (optional)"
                      value={customer.note}
                      onChange={e => setCustomer(p => ({ ...p, note: e.target.value }))}
                      rows={2}
                      className="w-full bg-dark-700 border border-white/10 text-white placeholder-white/30 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500/50 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery */}
          {step === 'delivery' && (
            <div className="space-y-4 animate-fade-in">
              {/* Customer name recap */}
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5">
                <User size={13} className="text-green-400" />
                <span className="text-green-300 text-sm font-medium">{customer.name}</span>
                {customer.phone && <span className="text-green-300/60 text-xs ml-auto">{customer.phone}</span>}
              </div>

              {/* Mode selection */}
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">How do you want it?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMode('delivery')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 ${
                      mode === 'delivery' ? 'bg-brand-500/20 border-brand-500/50 text-brand-300' : 'bg-dark-700 border-white/5 text-white/60 hover:border-white/20'
                    }`}
                  >
                    <Navigation size={22} />
                    <span className="font-medium text-sm">Delivery</span>
                    <span className="text-[11px] opacity-70">To your door</span>
                  </button>
                  <button
                    onClick={() => setMode('pickup')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 ${
                      mode === 'pickup' ? 'bg-brand-500/20 border-brand-500/50 text-brand-300' : 'bg-dark-700 border-white/5 text-white/60 hover:border-white/20'
                    }`}
                  >
                    <Package size={22} />
                    <span className="font-medium text-sm">Pickup</span>
                    <span className="text-[11px] opacity-70">From restaurant</span>
                  </button>
                </div>
              </div>

              {/* Delivery location */}
              {mode === 'delivery' && (
                <div className="space-y-3 animate-slide-down">
                  <button
                    onClick={detectLocation}
                    disabled={locating}
                    className="w-full flex items-center gap-3 bg-dark-700 hover:bg-dark-600 border border-white/5 hover:border-brand-500/30 rounded-2xl p-4 transition-all duration-200 text-left"
                  >
                    {locating ? <Loader size={18} className="text-brand-400 animate-spin" /> : <Navigation size={18} className={location ? 'text-green-400' : 'text-white/40'} />}
                    <div>
                      <p className="text-white text-sm font-medium">{location ? 'Location Detected ✓' : locating ? 'Detecting…' : 'Use My Location'}</p>
                      {location && <p className="text-white/40 text-xs mt-0.5">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>}
                    </div>
                  </button>

                  {locError && (
                    <div className="flex items-start gap-2 text-amber-400 text-xs bg-amber-500/10 rounded-xl p-3">
                      <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                      {locError}
                    </div>
                  )}

                  <p className="text-white/30 text-xs text-center">— or enter manually —</p>
                  <input
                    type="text"
                    placeholder="Your delivery address…"
                    value={manualAddress}
                    onChange={e => handleManualAddress(e.target.value)}
                    className="w-full bg-dark-700 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
                  />

                  {deliveryFee !== null && (
                    <div className="grid grid-cols-3 gap-2 animate-fade-in">
                      {[
                        { icon: <MapPin size={14} />, value: `${distance?.toFixed(1)} km`, label: 'Distance' },
                        { icon: <Package size={14} />, value: formatCurrency(deliveryFee), label: 'Fee' },
                        { icon: <Clock size={14} />, value: estTime, label: 'ETA' },
                      ].map(({ icon, value, label }) => (
                        <div key={label} className="bg-dark-700 rounded-xl p-3 text-center">
                          <div className="text-brand-400 flex justify-center mb-1">{icon}</div>
                          <p className="text-white font-semibold text-xs">{value}</p>
                          <p className="text-white/40 text-[10px]">{label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pickup info */}
              {mode === 'pickup' && (
                <div className="bg-dark-700 rounded-2xl p-4 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">Restaurant Address</p>
                      <p className="text-white/50 text-xs mt-1">{RESTAURANT_INFO.address}</p>
                      <p className="text-brand-400 text-xs mt-1">Ready in ~20–30 minutes</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5">
          {step === 'details' ? (
            <>
              <button
                onClick={() => setStep('delivery')}
                disabled={!detailsValid}
                className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-2xl transition-all duration-200 ${
                  detailsValid
                    ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/20 active:scale-98'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                Continue to Delivery
                <ChevronRight size={16} />
              </button>
              {!detailsValid && <p className="text-center text-white/25 text-xs mt-2">Please enter your name to continue</p>}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => setStep('details')} className="text-white/40 hover:text-white/70 text-sm transition-colors">← Back</button>
                <span className="text-white font-bold text-lg">{formatCurrency(grandTotal)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={!deliveryReady}
                className={`w-full flex items-center justify-center gap-2.5 font-semibold py-3.5 rounded-2xl transition-all duration-200 ${
                  deliveryReady
                    ? 'bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/20 active:scale-98'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Send Order on WhatsApp
                <ChevronRight size={16} />
              </button>
              {!deliveryReady && !mode && <p className="text-center text-white/25 text-xs mt-2">Please select delivery or pickup</p>}
              {!deliveryReady && mode === 'delivery' && <p className="text-center text-white/25 text-xs mt-2">Please add a delivery location</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
