import React from 'react';
import { ChevronDown, Star, Clock, MapPin } from 'lucide-react';

export default function Hero() {
  const scrollToMenu = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80"
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/65 via-dark-900/55 to-dark-900" />
        <div className="absolute inset-0 hero-glow" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white/80 mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Open now · Closes 10 PM
        </div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[0.95] mb-5 animate-scale-in">
          Real food,<br />
          <span className="text-gradient italic">real flavour</span>
        </h1>

        <p className="text-white/60 text-lg md:text-xl max-w-md mx-auto mb-10 font-light leading-relaxed animate-fade-in">
          Home-style cooking done right. Order online and get it delivered or pick up fresh.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 animate-slide-up">
          <button
            onClick={scrollToMenu}
            className="btn-primary text-base px-8 py-3.5 rounded-2xl font-semibold"
          >
            See the Menu
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 text-sm animate-fade-in">
          <div className="flex items-center gap-2 text-white/60">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span><strong className="text-white">4.8</strong> rating</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2 text-white/60">
            <Clock size={14} className="text-brand-400" />
            <span><strong className="text-white">30–45</strong> min delivery</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2 text-white/60">
            <MapPin size={14} className="text-brand-400" />
            <span>Airport Bypass, Accra</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToMenu}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/80 transition-colors animate-bounce"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}
