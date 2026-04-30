import { RESTAURANT_INFO } from '../data/menu';

export const formatCurrency = (amount) => `GH₵ ${amount.toFixed(2)}`;

export const formatWhatsAppOrder = (items, deliveryInfo, total, customer = {}) => {
  const itemLines = items
    .map(i => `  • ${i.name} ×${i.quantity} — GH₵ ${(i.price * i.quantity).toFixed(2)}`)
    .join('\n');

  const customerLine = customer.name
    ? `\n👤 *Customer:* ${customer.name}${customer.phone ? `\n📞 *Phone:* ${customer.phone}` : ''}${customer.note ? `\n📝 *Note:* ${customer.note}` : ''}\n`
    : '';

  const deliveryLine = deliveryInfo?.type === 'delivery'
    ? `\n🚗 *Delivery* to: ${deliveryInfo.address || 'Location shared'}\n   Delivery fee: GH₵ ${deliveryInfo.fee?.toFixed(2)}`
    : '\n🏠 *Pickup* at restaurant';

  const grandTotal = deliveryInfo?.type === 'delivery'
    ? total + (deliveryInfo.fee || 0)
    : total;

  return `🍽️ *Order — Bridge Pub*\n${customerLine}\n*Items:*\n${itemLines}\n\n*Subtotal:* GH₵ ${total.toFixed(2)}${deliveryLine}\n\n*TOTAL: GH₵ ${grandTotal.toFixed(2)}*\n\nPlease confirm my order. Thank you!`;
};

export const openWhatsApp = (message) => {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${encoded}`, '_blank');
};

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateDeliveryFee = (distanceKm) => {
  const fee = RESTAURANT_INFO.baseFee + distanceKm * RESTAURANT_INFO.perKmRate;
  return Math.round(fee * 2) / 2; // Round to nearest 0.5
};

export const estimateDeliveryTime = (distanceKm) => {
  const baseMinutes = 20;
  const perKmMinutes = 3;
  const total = Math.round(baseMinutes + distanceKm * perKmMinutes);
  return `${total}–${total + 10} mins`;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  }
};
