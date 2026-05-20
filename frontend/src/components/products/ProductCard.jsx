import PropTypes from 'prop-types';
import LazyImage from '@/components/ui/LazyImage';

const CATEGORY_COLORS = {
  electronics: 'bg-blue-500/20 text-blue-300',
  fashion: 'bg-pink-500/20 text-pink-300',
  food: 'bg-orange-500/20 text-orange-300',
  health: 'bg-green-500/20 text-green-300',
  home: 'bg-yellow-500/20 text-yellow-300',
  sports: 'bg-cyan-500/20 text-cyan-300',
  toys: 'bg-purple-500/20 text-purple-300',
  other: 'bg-slate-500/20 text-slate-300',
};

const formatCurrency = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

export default function ProductCard({ product, onEdit, onDelete }) {
  const { name, price, stock, category, images, isActive } = product;
  const thumbnail = images?.[0]?.url;

  let stockColorClass;
  if (stock === 0) {
    stockColorClass = 'text-red-400';
  } else if (stock < 5) {
    stockColorClass = 'text-yellow-400';
  } else {
    stockColorClass = 'text-slate-400';
  }

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col hover:border-slate-600 transition-colors">
      {/* Thumbnail */}
      <div className="relative h-40 bg-slate-700 shrink-0">
        {thumbnail ? (
          <LazyImage src={thumbnail} alt={name} className="w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-4xl">
            📦
          </div>
        )}
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${
            isActive
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-white truncate" title={name}>
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-emerald-400 font-bold text-sm">{formatCurrency(price)}</span>
          <span
            className={`text-xs font-medium ${stockColorClass}`}
          >
            {stock === 0 ? 'Out of stock' : `Stock: ${stock}`}
          </span>
        </div>

        <span
          className={`text-xs px-2 py-0.5 rounded-full w-fit ${
            CATEGORY_COLORS[category] || CATEGORY_COLORS.other
          }`}
        >
          {category}
        </span>

        {/* Actions */}
        <div className="mt-auto pt-3 flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 py-1.5 text-sm rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 py-1.5 text-sm rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-300 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    category: PropTypes.string,
    isActive: PropTypes.bool,
    images: PropTypes.arrayOf(
      PropTypes.shape({ url: PropTypes.string.isRequired })
    ),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
