import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { MENU_ITEMS } from '../data/menu';

export default function Lightbox({ item, onClose }) {
  const [currentId, setCurrentId] = useState(item.id);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState(null);
  const imgRef = useRef(null);

  const currentItem = MENU_ITEMS.find(i => i.id === currentId) || item;
  const currentIndex = MENU_ITEMS.findIndex(i => i.id === currentId);

  const goPrev = useCallback(() => {
    const idx = MENU_ITEMS.findIndex(i => i.id === currentId);
    const prev = MENU_ITEMS[(idx - 1 + MENU_ITEMS.length) % MENU_ITEMS.length];
    setCurrentId(prev.id);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [currentId]);

  const goNext = useCallback(() => {
    const idx = MENU_ITEMS.findIndex(i => i.id === currentId);
    const next = MENU_ITEMS[(idx + 1) % MENU_ITEMS.length];
    setCurrentId(next.id);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [currentId]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goPrev, goNext]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoom(prev => Math.max(1, Math.min(4, prev + delta)));
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    if (Math.abs(dx) > 50) {
      dx < 0 ? goNext() : goPrev();
    }
    setTouchStart(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 animate-fade-in">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all"
      >
        <X size={18} className="text-white" />
      </button>

      {/* Nav */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all"
      >
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all"
      >
        <ChevronRight size={20} className="text-white" />
      </button>

      {/* Image */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <img
          ref={imgRef}
          src={currentItem.image}
          alt={currentItem.name}
          className="max-w-[90vw] max-h-[75vh] object-contain rounded-xl transition-transform duration-200 select-none"
          style={{
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
          }}
          draggable={false}
        />
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-6">
        <div className="max-w-lg mx-auto">
          <h3 className="font-display text-2xl font-bold text-white mb-1">{currentItem.name}</h3>
          <p className="text-white/60 text-sm mb-3">{currentItem.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-brand-400 font-bold text-lg">GH₵ {currentItem.price.toFixed(2)}</p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoom(z => Math.max(1, z - 0.5))}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
              >
                <ZoomOut size={14} className="text-white" />
              </button>
              <span className="text-white/50 text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(z => Math.min(4, z + 0.5))}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
              >
                <ZoomIn size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
        {MENU_ITEMS.slice(0, Math.min(15, MENU_ITEMS.length)).map((m, i) => (
          <button
            key={m.id}
            onClick={() => { setCurrentId(m.id); setZoom(1); setOffset({ x: 0, y: 0 }); }}
            className={`rounded-full transition-all duration-200 ${
              m.id === currentId ? 'w-4 h-1.5 bg-brand-400' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
