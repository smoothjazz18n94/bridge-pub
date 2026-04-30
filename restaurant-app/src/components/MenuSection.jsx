import React, { useEffect, useRef } from 'react';
import { CATEGORIES, MENU_ITEMS } from '../data/menu';
import MenuCard from './MenuCard';
import UpsellBanner from './UpsellBanner';

export default function MenuSection({ onAddToCart, onImageClick, onToast, onUpsell }) {
  const sectionRefs = useRef({});

  useEffect(() => {
    const observers = [];
    CATEGORIES.forEach(cat => {
      const el = document.getElementById(cat.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.querySelectorAll('.menu-card-anim').forEach((card, i) => {
              card.style.animationDelay = `${i * 60}ms`;
              card.classList.add('animate-scale-in');
            });
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      {/* Section header */}
      <div className="text-center mb-16">
        <p className="text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">Our Menu</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          Crafted with fire,<br /><em className="text-gradient not-italic">served with care</em>
        </h2>
        <p className="text-white/40 max-w-md mx-auto">Every dish is prepared fresh to order. Browse our selection and add your favourites to the cart.</p>
      </div>

      {/* Categories */}
      <div className="space-y-20">
        {CATEGORIES.map((cat, catIdx) => {
          const items = MENU_ITEMS.filter(i => i.category === cat.id);
          return (
            <div key={cat.id} id={cat.id} ref={el => sectionRefs.current[cat.id] = el}>
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.emoji}</span>
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-white">{cat.label}</h3>
                    <p className="text-white/30 text-sm">{items.length} items</p>
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map(item => (
                  <div key={item.id} className="menu-card-anim opacity-100">
                    <MenuCard
                      item={item}
                      onAddToCart={onAddToCart}
                      onImageClick={onImageClick}
                      onToast={onToast}
                    />
                  </div>
                ))}
              </div>

              {/* Upsell Banner */}
              {catIdx < CATEGORIES.length - 1 && (
                <UpsellBanner category={cat.id} onAddToCart={onAddToCart} onImageClick={onImageClick} onToast={onToast} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
