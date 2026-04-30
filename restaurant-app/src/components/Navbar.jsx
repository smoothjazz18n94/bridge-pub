import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Flame } from 'lucide-react';
import { CATEGORIES } from '../data/menu';

export default function Navbar({ cartCount, onCartOpen, activeCategory, onCategoryChange }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-dark-900/95 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/30'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Flame size={16} className="text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg leading-none">Bridge Pub</span>
                <p className="text-white/30 text-[10px] leading-none mt-0.5 tracking-widest uppercase">BP</p>
              </div>
            </div>

            {/* Desktop category tabs */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-2xl p-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryChange(cat.id);
                    document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={onCartOpen}
                className="relative flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 shadow-lg shadow-brand-500/20 active:scale-95"
              >
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-brand-600 text-xs font-bold rounded-full flex items-center justify-center animate-bounce-light">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                className="md:hidden text-white/70 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-800/98 backdrop-blur-xl border-t border-white/5 px-4 py-3 animate-slide-down">
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryChange(cat.id);
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
