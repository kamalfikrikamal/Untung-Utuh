import React from 'react';
import { CheckCircle, XCircle, Shield, Zap, TrendingUp, CreditCard } from 'lucide-react';
import PricingCard from '../components/pricing/PricingCard';
import PricingFAQ from '../components/pricing/PricingFAQ';
import TestimonialCard from '../components/pricing/TestimonialCard';
import HeroCTA from '../components/layout/HeroCTA';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = React.useState(false);

  const packages = [
    {
      name: 'Gratis',
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Mulai mengelola toko online Anda dengan fitur dasar yang esensial.',
      targetAudience: 'Cocok untuk pemula atau toko yang baru mulai berjualan online.',
      features: [
        { enabled: true, description: '1 Toko Online' },
        { enabled: true, description: '10 Produk Aktif' },
        { enabled: true, description: 'Analytics Dasar' },
        { enabled: true, description: 'Template Standar' },
        { enabled: false, description: 'Custom Domain' },
        { enabled: false, description: 'Hapus Watermark' },
        { enabled: false, description: 'Multi-User' },
      ],
      buttonText: 'Mulai Gratis',
    },
    {
      name: 'Pro',
      priceMonthly: 49000,
      priceYearly: 490000,
      description: 'Fitur lengkap untuk bisnis yang serius dan siap berkembang.',
      targetAudience: 'Ideal untuk UMKM yang sudah memiliki pelanggan tetap dan ingin ekspansi.',
      features: [
        { enabled: true, description: '1 Toko Online' },
        { enabled: true, description: '50 Produk Aktif' },
        { enabled: true, description: 'Custom Domain' },
        { enabled: true, description: 'Hapus Watermark' },
        { enabled: true, description: 'Analytics Lengkap + Export CSV' },
        { enabled: true, description: '2 Akun Staff' },
        { enabled: true, description: 'Backup Mingguan' },
        { enabled: true, description: 'Support Prioritas 24/7' },
      ],
      buttonText: 'Upgrade ke Pro',
      isPopular: true,
    },
    {
      name: 'Premium',
      priceMonthly: 99000,
      priceYearly: 990000,
      description: 'Semua fitur maksimal untuk bisnis skala menengah hingga besar.',
      targetAudience: 'Untuk bisnis yang membutuhkan kontrol penuh dan efisiensi maksimal.',
      features: [
        { enabled: true, description: 'Produk Tanpa Batas' },
        { enabled: true, description: 'Custom Domain' },
        { enabled: true, description: 'Hapus Watermark' },
        { enabled: true, description: 'Analytics Real-time' },
        { enabled: true, description: '5 Akun Staff dengan Role Permission' },
        { enabled: true, description: 'Support Prioritas 24/7' },
        { enabled: true, description: 'Backup Harian Otomatis' },
        { enabled: true, description: 'API Access' },
      ],
      buttonText: 'Upgrade ke Premium',
    },
  ];

  const comparisonRows = [
    {
      label: 'Jumlah Produk',
      values: ['10', '50', 'Unlimited'],
    },
    {
      label: 'Custom Domain',
      values: [false, true, true],
    },
    {
      label: 'Hapus Watermark',
      values: [false, true, true],
    },
    {
      label: 'Level Analytics',
      values: ['Dasar', 'Lengkap + Export CSV', 'Real-time + Export CSV'],
    },
    {
      label: 'Jumlah Admin / Staff',
      values: ['1 (Pemilik)', '2 Staff', '5 Staff + Role Permission'],
    },
    {
      label: 'Backup Data',
      values: ['Manual', 'Backup Mingguan', 'Backup Harian Otomatis'],
    },
    {
      label: 'Support',
      values: ['Email', 'Prioritas 24/7', 'Prioritas 24/7 + Manajer Akun'],
    },
    {
      label: 'API Access',
      values: [false, false, true],
    },
  ];

  const testimonials = [
     {
      avatar: 'https://placehold.co/100x100/10b981/ffffff?text=AS',
      name: 'Andi Saputra',
      role: 'Owner Toko Elektronik Online',
      quote: "Dari marketplace pindah ke Untung Utuh, omzet naik 40% dalam 3 bulan. Komisi 0% bikin profit langsung jadi. Paling enak bisa kontrol semua data sendiri tanpa harus bayar iklan terus-terusan.",
     },
     {
      avatar: 'https://placehold.co/100x100/059669/ffffff?text=BK',
      name: 'Bella Kusuma',
      role: 'Founder Fashion Store',
      quote: "Awalnya ragu karena belum pernah pakai platform sendiri. Tapi setelah coba paket Pro, saya kaget betapa mudahnya dan murah banget dibanding bayar komisi 15% di marketplace. Sekarang sudah setahun lebih, sangat puas!",
     },
     {
      avatar: 'https://placehold.co/100x100/047857/ffffff?text=CD',
      name: 'Citra Dewi',
      role: 'Manager Kuliner Online',
      quote: "Sebagai yang pakai paket Premium, saya bisa manage 3 toko sekaligus dengan tim 5 orang. Analytics-nya sangat detail, bisa lihat mana produk yang performanya bagus. Support 24/7 juga responsif banget. Worth it!",
     },
   ];

  const trustBadges = [
    { icon: <Shield className="w-6 h-6" />, label: 'Pembatalan Kapan Saja', color: 'bg-emerald-100 text-emerald-700' },
    { icon: <CreditCard className="w-6 h-6" />, label: '0% Komisi Selamanya', color: 'bg-emerald-100 text-emerald-700' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Gratis Paket Dasar', color: 'bg-emerald-100 text-emerald-700' },
  ];

  const renderCellValue = (value) => {
    if (value === true) {
      return <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />;
    }
    if (value === false) {
      return <XCircle className="w-5 h-5 text-gray-300 mx-auto" />;
    }
    return <span className="text-sm font-semibold text-gray-900">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Harga Transparan,<br />Tanpa Biaya Tersembunyi
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Model 0% komisi per transaksi dengan biaya langganan flat opsional. Tidak ada biaya tersembunyi, tidak ada biaya tambahan yang mengejutkan.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
            {trustBadges.map((badge, index) => (
              <div key={index} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${badge.color}`}>
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>

          {/* Toggle Switch */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <span className={`text-sm font-semibold transition-colors duration-300 select-none ${
              !isAnnual ? 'text-blue-600' : 'text-gray-400'
            }`}>Bulanan</span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-16 h-8 rounded-full shadow-inner focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 transition-all duration-300 ease-in-out cursor-pointer focus:outline-none ${
                isAnnual
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 shadow-amber-200'
                  : 'bg-gradient-to-r from-blue-400 to-cyan-400 shadow-blue-200'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${
                  isAnnual ? 'translate-x-9' : 'translate-x-1'
                } ${isAnnual ? 'shadow-amber-300/50' : 'shadow-blue-300/50'}`}
              />
            </button>
            <span className={`text-sm font-semibold transition-colors duration-300 select-none ${
              isAnnual ? 'text-amber-600' : 'text-gray-400'
            }`}>Tahunan</span>
            {isAnnual && (
              <span className="inline-flex items-center gap-1 text-emerald-600 text-sm font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                <Zap className="w-4 h-4" />
                -33%
              </span>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <PricingCard
                key={index}
                {...pkg}
                price={isAnnual ? pkg.priceYearly : pkg.priceMonthly}
                isAnnual={isAnnual}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
             Perbandingan Fitur
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
             Lihat perbedaan detail setiap paket dan pilih yang paling sesuai dengan kebutuhan bisnis Anda.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-lg">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-gray-100 px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Fitur
                  </th>
                  {['Gratis', 'Pro', 'Premium'].map((name, i) => (
                    <th
                      key={name}
                      className={`px-6 py-4 text-center text-sm font-bold uppercase tracking-wider ${
                        i === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {name}
                      {i === 1 && (
                        <span className="block mt-1 text-[10px] font-semibold text-emerald-500 uppercase tracking-wide">
                          Paling Laris
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors duration-150 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    } hover:bg-gray-100`}
                  >
                    <td className="sticky left-0 bg-inherit px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {row.label}
                    </td>
                    {row.values.map((value, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-6 py-4 text-center whitespace-nowrap ${
                          colIdx === 1 ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        {renderCellValue(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
             Apa Kata Mereka?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
             Ribuan bisnis telah beralih ke Untung Utuh dan mengalami pertumbuhan yang signifikan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <PricingFAQ />

      {/* CTA Banner */}
      <HeroCTA />
    </div>
  );
};

export default Pricing;
