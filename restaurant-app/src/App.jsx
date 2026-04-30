import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import PaymentModal from './components/PaymentModal';
import Lightbox from './components/Lightbox';
import ToastContainer from './components/ToastContainer';
import FloatingCart from './components/FloatingCart';
import Footer from './components/Footer';
import { useCart } from './hooks/useCart';
import { useToast } from './hooks/useToast';
import { CATEGORIES } from './data/menu';

export default function App() {
  const { items, addItem, removeItem, updateQuantity, clearCart, total, count } = useCart();
  const { toasts, addToast, removeToast } = useToast();

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  // Track active category on scroll
  useEffect(() => {
    const handler = () => {
      const offsets = CATEGORIES.map(cat => {
        const el = document.getElementById(cat.id);
        if (!el) return { id: cat.id, top: Infinity };
        return { id: cat.id, top: Math.abs(el.getBoundingClientRect().top - 100) };
      });
      const closest = offsets.sort((a, b) => a.top - b.top)[0];
      if (closest) setActiveCategory(closest.id);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleCheckout = () => {
    setCartOpen(false);
    setTimeout(() => setCheckoutOpen(true), 200);
  };

  const handlePayment = (info, customer) => {
    setDeliveryInfo(info);
    setCustomerInfo(customer);
    setCheckoutOpen(false);
    setTimeout(() => setPaymentOpen(true), 200);
  };

  const handleOrderComplete = () => {
    clearCart();
    addToast('Order confirmed! 🎉 We\'ll be in touch soon.', 'success', 5000);
  };

  // Lock scroll when modals open
  useEffect(() => {
    const anyOpen = cartOpen || checkoutOpen || paymentOpen || !!lightboxItem;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen, checkoutOpen, paymentOpen, lightboxItem]);

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar
        cartCount={count}
        onCartOpen={() => setCartOpen(true)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <Hero />

      <MenuSection
        onAddToCart={addItem}
        onImageClick={setLightboxItem}
        onToast={addToast}
      />

      <Footer />

      {/* Floating cart (mobile) */}
      <FloatingCart
        count={count}
        total={total}
        onClick={() => setCartOpen(true)}
      />

      {/* Modals */}
      {cartOpen && (
        <CartModal
          items={items}
          total={total}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          onCheckout={handleCheckout}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          items={items}
          total={total}
          onClose={() => setCheckoutOpen(false)}
          onPayment={handlePayment}
          onToast={addToast}
        />
      )}

      {paymentOpen && (
        <PaymentModal
          total={total}
          deliveryInfo={deliveryInfo}
          cartItems={items}
          customer={customerInfo}
          onClose={() => setPaymentOpen(false)}
          onToast={addToast}
          onComplete={handleOrderComplete}
        />
      )}

      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
