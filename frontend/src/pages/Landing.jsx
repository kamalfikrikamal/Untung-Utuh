import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import FadeInSection from '../components/ui/FadeInSection';
import {
  Zap,
  MessageCircle,
  BadgeDollarSign,
  ArrowRight,
  Store,
  Package,
  BarChart2,
  Smartphone,
  ShieldCheck,
  Palette,
  CheckCircle2,
} from 'lucide-react';

/* ── Data ───────────────────────────────────────────────── */

const features = [
  {
    Icon: Zap,
    title: 'Lightning Fast',
    description:
      'Katalog online ringan, load <2 detik bahkan di 3G. Bisa diakses offline, tampil sempurna di semua perangkat.',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    Icon: MessageCircle,
    title: 'Order via WhatsApp',
    description:
      'Pembeli pesan langsung lewat WhatsApp dengan pesan otomatis. Tidak perlu payment gateway rumit, konfirmasi manual lebih mudah.',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
  },
  {
    Icon: BadgeDollarSign,
    title: '0% Komisi Per Transaksi',
    description:
      'Tidak ada potongan per transaksi. Bayar langganan flat (opsional). Hemat hingga 10% vs marketplace.',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
];

const stats = [
  { value: '10K+', label: 'Penjual Aktif' },
  { value: '99.9%', label: 'Uptime' },
  { value: '0%', label: 'Komisi Per Transaksi' },
];

const valueProps = [
  {
    Icon: Store,
    title: 'Toko Online Custom',
    description: 'Halaman toko dengan nama domain sendiri (untungutuh.app/namatoko).',
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
  },
  {
    Icon: Package,
    title: 'Manajemen Produk Mudah',
    description: 'Upload produk dengan drag-drop, kelola stok & harga dari dashboard.',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    Icon: BarChart2,
    title: 'Analytics Sederhana',
    description: 'Pantau views, klik produk, dan konversi order real-time.',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    Icon: Smartphone,
    title: 'Progressive Web App',
    description: 'Install di HP pembeli seperti aplikasi native, bisa akses offline.',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    Icon: ShieldCheck,
    title: 'Keamanan Terjamin',
    description: 'Data tersimpan aman, backup otomatis, SSL encryption standar bank.',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    Icon: Palette,
    title: '3 Template Siap Pakai',
    description: 'Pilih tema sesuai kategori usaha (kuliner, fashion, kerajinan, dll).',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
  },
];

const steps = [
  {
    emoji: '📝',
    title: 'Daftar Gratis',
    description: 'Buat akun dalam 30 detik, tidak perlu kartu kredit.',
  },
  {
    emoji: '📦',
    title: 'Upload Produk',
    description: 'Tambahkan foto, nama, harga, dan deskripsi produk Anda.',
  },
  {
    emoji: '🔗',
    title: 'Share Link Toko',
    description: 'Sebarkan link ke WhatsApp, Instagram, atau media sosial.',
  },
];

/* ── Component ──────────────────────────────────────────── */

export default function Landing() {
  return (
    <div className="flex flex-col w-full">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative px-4 pt-24 pb-28 sm:px-6 sm:pt-36 sm:pb-40 lg:px-8 flex flex-col items-center text-center overflow-hidden bg-white">
        <div className="pointer-events-none absolute -top-48 -right-48 h-[520px] w-[520px] rounded-full bg-primary-100/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-48 h-96 w-96 rounded-full bg-primary-50/70 blur-3xl" />
        <div className="pointer-events-none absolute top-28 left-1/3 h-60 w-60 rounded-full bg-primary-50/60 blur-2xl" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-8">
            <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
            <span>Mulai jualan online gratis sekarang</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
            Jualan Online Lebih{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              Untung
            </span>
            <br />
            Bebas Biaya Marketplace
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
            Buat toko online profesional dalam menit. Tanpa komisi, tanpa biaya bulanan.
            Cocok untuk UMKM Indonesia yang ingin untung lebih besar.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto group text-base px-8 shadow-lg"
              >
                Buat Toko Gratis
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#cara-kerja" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
                Lihat Cara Kerja
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────── */}
      <FadeInSection>
        <section className="bg-primary-600 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              {stats.map(({ value, label }, idx) => (
                <FadeInSection key={label} delay={idx * 150}>
                  <div className="flex flex-col items-center">
                    <p className="text-3xl sm:text-4xl font-extrabold text-white">{value}</p>
                    <p className="mt-1 text-sm text-primary-200 font-medium">{label}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Why Us (3 core benefits) ─────────────────────── */}
      <FadeInSection>
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              badge="Platform"
              title="Mengapa pilih Untung Utuh?"
              subtitle="Solusi toko online yang dirancang khusus untuk UMKM Indonesia."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {features.map(({ Icon, title, description, iconBg, iconColor }, idx) => (
                <FadeInSection key={title} delay={idx * 150}>
                  <div className="flex flex-col p-8 rounded-3xl bg-white border border-gray-100 hover:border-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm h-full">
                    <div className={`h-12 w-12 rounded-2xl ${iconBg} flex items-center justify-center mb-5 flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Value Proposition (6-grid) ───────────────────── */}
      <FadeInSection>
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              badge="Fitur Unggulan"
              title="Semua yang Anda butuhkan untuk jualan online"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {valueProps.map(({ Icon, title, description, iconBg, iconColor }, idx) => (
                <FadeInSection key={title} delay={(idx % 6) * 100}>
                  <div className="flex gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-md transition-all duration-200 h-full">
                    <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── How It Works ─────────────────────────────────── */}
      <FadeInSection>
        <section id="cara-kerja" className="py-24 px-4 sm:px-6 lg:px-8 bg-primary-50">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              badge="Cara Kerja"
              title="Mulai jualan dalam 3 langkah mudah"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {steps.map(({ emoji, title, description }, idx) => (
                <FadeInSection key={title} delay={idx * 150}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="h-20 w-20 rounded-full bg-white border-2 border-primary-200 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-3xl leading-none">{emoji}</span>
                      </div>
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shadow">
                        {idx + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{description}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 px-8 py-14 sm:px-16 text-center overflow-hidden shadow-2xl">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              {/* Headline */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                  Siap Tingkatkan Penjualan?
                </h2>
                <p className="text-primary-100 text-base sm:text-lg font-light max-w-md mx-auto leading-relaxed">
                  Bergabung dengan ribuan UMKM Indonesia yang sudah beralih ke Untung Utuh.
                  Hemat biaya komisi, fokus kembangkan usaha.
                </p>
              </div>

              {/* CTA Button */}
              <Link to="/register">
                <Button
                  size="lg"
                  className="text-base px-10 bg-white text-primary-700 hover:bg-primary-50 shadow-none font-semibold"
                >
                  Buat Toko Online Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              {/* Trust signals */}
              <div className="w-full pt-5 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  'Gratis selamanya untuk fitur dasar',
                  'Tidak perlu kartu kredit',
                  'Setup 5 menit langsung jualan',
                ].map((text) => (
                  <div key={text} className="flex items-center justify-center gap-2 text-sm text-primary-100">
                    <CheckCircle2 className="h-4 w-4 text-primary-300 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>

    </div>
  );
}
