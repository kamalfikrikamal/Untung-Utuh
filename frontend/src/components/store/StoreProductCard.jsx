import PropTypes from 'prop-types';
import LazyImage from '@/components/ui/LazyImage';

const formatCurrency = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

export default function StoreProductCard({ product, onClick }) {
  const { name, price, stock, images } = product;
  const thumbnail = images?.[0]?.url;

  return (
    <button
      onClick={onClick}
      className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 cursor-pointer hover:border-blue-500 transition-all duration-200 group text-left w-full"
    >
      <div className="h-48 bg-slate-700 overflow-hidden">
        {thumbnail ? (
          <LazyImage
            src={thumbnail}
            alt={name}
            className="w-full h-full"
            imgClassName="group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-5xl">
            📦
          </div>
        )}
      </div>

      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-white truncate">{name}</h3>
        <p className="text-emerald-400 font-bold text-sm">{formatCurrency(price)}</p>
        <p className={`text-xs ${stock === 0 ? 'text-red-400 font-medium' : 'text-slate-400'}`}>
          {stock === 0 ? 'Out of stock' : `${stock} available`}
        </p>
      </div>
    </button>
  );
}

StoreProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({ url: PropTypes.string.isRequired })
    ),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
