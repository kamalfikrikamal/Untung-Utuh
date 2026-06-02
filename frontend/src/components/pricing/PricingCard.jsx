import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { storage } from '../../utils/storage';

const PricingCard = ({
  name,
  priceMonthly,
  priceYearly,
  description,
  targetAudience,
  features,
  isPopular,
  buttonText,
  buttonVariant = 'primary',
  showFreeTierFeatures = false,
  isAnnual,
}) => {
  const navigate = useNavigate();
  const currentPrice = isAnnual ? priceYearly : priceMonthly;
  const periodText = isAnnual ? '/tahun' : '/bulan';

  const handleClick = () => {
    const isAuthenticated = !!storage.getToken();
    const subscription = storage.getSubscription();

    if (name === 'Gratis') {
      navigate(isAuthenticated ? '/dashboard' : '/login');
    } else {
      // Pro or Premium
      if (subscription) {
        navigate(isAuthenticated ? '/dashboard' : '/login');
      } else {
        navigate('/invoice');
      }
    }
  };

  return (
    <div
      className={`relative flex flex-col h-full p-8 bg-white rounded-2xl transition-all duration-300 hover:shadow-xl ${
        isPopular
          ? 'ring-2 ring-emerald-500 shadow-xl scale-105 z-10'
          : 'shadow-lg hover:shadow-xl'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-emerald-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
            Paling Laris
          </span>
        </div>
      )}

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900">Rp {currentPrice.toLocaleString('id-ID')}</span>
          <span className="text-gray-600">{periodText}</span>
        </div>
      </div>

      <div className="flex-grow mb-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              {feature.enabled ? (
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              )}
              <span className={feature.enabled ? 'text-gray-700' : 'text-gray-500 line-through'}>
                {feature.description}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleClick}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
          name === 'Gratis'
            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        {buttonText}
      </button>

      <p className="mt-3 text-xs text-center text-gray-500">{targetAudience}</p>
    </div>
  );
};

export default PricingCard;
