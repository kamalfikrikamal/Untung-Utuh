import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { trackEvent } from '@/services/analyticsService';

const formatCurrency = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

export default function ProductDetailModal({ product, onClose, whatsapp, storeId }) {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  // Track product click each time a different product is opened
  useEffect(() => {
    if (!product || !storeId) return;
    trackEvent({ storeId, productId: product._id, eventType: 'click' });
  }, [product?._id, storeId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) return null;

  const { name, description, price, stock, images, category } = product;
  const total = price * qty;

  const handleOrderWhatsApp = () => {
    // Track wa_order event before opening WhatsApp
    if (storeId) {
      trackEvent({ storeId, productId: product._id, eventType: 'wa_order' });
    }
    const text = encodeURIComponent(
      `Halo, saya ingin memesan:\n\n*${name}*\nJumlah: ${qty}\nTotal: ${formatCurrency(total)}\n\nMohon konfirmasinya, terima kasih!`
    );
    const phone = (whatsapp ?? '').replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal open={!!product} onClose={onClose} title={name} size="lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Image gallery */}
        <div className="space-y-2">
          <div className="aspect-square bg-slate-700 rounded-xl overflow-hidden">
            {images?.length > 0 ? (
              <img
                src={images[activeImg]?.url}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-6xl">
                📦
              </div>
            )}
          </div>
          {images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImg ? 'border-blue-500' : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="space-y-4">
          <div>
            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(price)}</p>
            <p className={`text-sm mt-1 ${stock === 0 ? 'text-red-400 font-medium' : 'text-slate-400'}`}>
              {stock === 0 ? 'Out of stock' : `${stock} in stock`}
            </p>
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
              {category}
            </span>
          </div>

          {description && (
            <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
          )}

          {stock > 0 && (
            <>
              {/* Quantity selector */}
              <div>
                <p id="qty-label" className="block text-sm text-slate-400 mb-2">Quantity</p>
                <div role="group" aria-labelledby="qty-label" className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors text-lg font-medium"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-white font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(stock, q + 1))}
                    className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors text-lg font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-400">
                Total:{' '}
                <span className="text-white font-bold text-base">{formatCurrency(total)}</span>
              </p>

              {whatsapp && (
                <button
                  onClick={handleOrderWhatsApp}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 23.885l6.197-1.623A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.213-3.68.964.982-3.589-.234-.369A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
                  </svg>
                  Order via WhatsApp
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
