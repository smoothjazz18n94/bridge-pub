import React from 'react';
import { MapPin, Clock, Phone, Flame, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Flame size={17} className="text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-xl leading-none">Bridge Pub</span>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              Fire-kissed flavours rooted in bold African tradition. Premium ingredients, open-fire cooking, unforgettable dining.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors">
                <Instagram size={15} className="text-white/60" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors">
                <Facebook size={15} className="text-white/60" />
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Hours</h4>
            <div className="space-y-2 text-sm">
              {[
                { day: 'Mon – Thu', hours: '12:00 – 22:00' },
                { day: 'Fri – Sat', hours: '12:00 – 23:00' },
                { day: 'Sunday', hours: '13:00 – 21:00' },
              ].map(({ day, hours }) => (
                <div key={day} className="flex justify-between text-white/50">
                  <span>{day}</span>
                  <span className="text-white/70">{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Find Us</h4>
            <div className="space-y-3 text-sm text-white/50">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
                <span>Malejor School Junction Bypass Road,<br />Accra, Ghana</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-brand-400 flex-shrink-0" />
                <span>+233 24 400 0000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={14} className="text-brand-400 flex-shrink-0" />
                <span>Open today until 11 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <p>© {new Date().getFullYear()} "Bridge-Pub". All rights reserved.</p>
          <p>Built with 🔥 for great food lovers</p>
        </div>
      </div>
    </footer>
  );
}
