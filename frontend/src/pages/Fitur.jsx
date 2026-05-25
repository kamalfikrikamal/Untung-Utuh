import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Palette,
  Search,
  MessageCircle,
  ClipboardList,
  Truck,
  BarChart2,
  Activity,
  TrendingUp,
  Smartphone,
  Layers,
  ShieldCheck,
} from 'lucide-react';

/* ── ROI Calculator ──────────────────────────────────────── */

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function RoiCalculator() {
  const [revenue, setRevenue] = useState(5_000_000);
  const savings = revenue * 0.10;
  const annualSavings = savings * 12;

  return (
    <div className="rounded-2xl bg-primary-50 border border-primary-100 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Kalkulator ROI</h3>
          <p className="text-xs text-gray-500">Hitung penghematan nyata Anda vs marketplace</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-3">
          Rata-rata pendapatan bulanan Anda
        </label>
        <input
          type="range"
          min={1_000_000}
          max={50_000_000}
          step={500_000}
          value={revenue}
          onChange={(e) => setRevenue(Number(e.target.value))}
          className="w-full cursor-pointer accent-primary-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1.5">
          <span>Rp 1 jt</span>
          <span className="text-sm font-bold text-gray-800">{formatRupiah(revenue)}<span className="font-normal text-gray-400">/bln</span></span>
          <span>Rp 50 jt</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-center">
          <p className="text-xs font-medium text-red-500 mb-1">Komisi marketplace (avg 10%)</p>
          <p className="text-xl font-bold text-red-600">{formatRupiah(savings)}</p>
          <p className="text-xs text-gray-400 mt-0.5">yang hilang per bulan</p>
        </div>
        <div className="rounded-xl bg-primary-600 p-4 text-center">
          <p className="text-xs font-medium text-primary-200 mb-1">Hemat pakai Untung Utuh</p>
          <p className="text-xl font-bold text-white">{formatRupiah(savings)}</p>
          <p className="text-xs text-primary-300 mt-0.5">kembali ke kantong Anda</p>
        </div>
      </div>

      <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
        <p className="text-sm font-medium text-emerald-700">Penghematan total dalam 1 tahun</p>
        <p className="text-4xl font-extrabold text-emerald-700 mt-1 tracking-tight">
          {formatRupiah(annualSavings)}
        </p>
        <p className="text-xs text-emerald-600 mt-1">
          Dihitung dari komisi 10% rata-rata platform marketplace Indonesia
        </p>
      </div>
    </div>
  );
}

/* ── Data ────────────────────────────────────────────────── */

const categories = [
  {
    id: 'toko',
    badge: 'Manajemen Toko',
    badgeColor: 'text-primary-600',
    title: 'Manajemen Toko & Branding',
    description:
      'Bangun identitas merek yang kuat dengan alat yang dirancang agar toko Anda tampil profesional sejak hari pertama.',
    bg: 'bg-white',
    features: [
      {
        Icon: Globe,
        title: 'Kustomisasi Domain',
        description:
          'Toko Anda hadir di alamat yang mudah diingat: untungutuh.app/namatoko. Upgrade ke domain pribadi kapan saja.',
        bullets: [
          'Sub-domain gratis selamanya',
          'Koneksi domain pribadi (misal: tokosaya.com)',
          'HTTPS aman via platform',
        ],
        iconBg: 'bg-primary-50',
        iconColor: 'text-primary-600',
      },
      {
        Icon: Palette,
        title: 'Tema Responsif per Kategori',
        description:
          'Tampilan toko otomatis menyesuaikan jenis usaha: Kuliner, Fashion, atau Umum.',
        bullets: [
          '3 template siap pakai',
          'Penyesuaian warna & logo toko',
          'Preview langsung sebelum publikasi',
        ],
        iconBg: 'bg-rose-50',
        iconColor: 'text-rose-500',
      },
      {
        Icon: Search,
        title: 'Optimasi Pencarian',
        description:
          'Meta tags, sitemap XML, dan struktur halaman yang ramah mesin pencari.',
        bullets: [
          'Open Graph untuk share media sosial',
          'Sitemap diperbarui otomatis',
          'Struktur data produk untuk Google',
        ],
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-600',
      },
    ],
  },
  {
    id: 'order',
    badge: 'Order & Penjualan',
    badgeColor: 'text-green-600',
    title: 'Sistem Order & Penjualan',
    description:
      'Dari klik produk hingga konfirmasi pesanan — semua berjalan mulus tanpa payment gateway yang rumit.',
    bg: 'bg-gray-50',
    features: [
      {
        Icon: MessageCircle,
        title: 'Integrasi WhatsApp Otomatis',
        description:
          'Pembeli klik tombol order → pesan WhatsApp terstruktur otomatis lengkap dengan nama produk, jumlah, dan total harga.',
        bullets: [
          'Format pesan otomatis',
          'Link langsung ke nomor Anda',
          'Tidak perlu payment gateway rumit',
        ],
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600',
      },
      {
        Icon: ClipboardList,
        title: 'Dashboard Status Pesanan',
        description:
          'Kelola semua pesanan masuk dari satu dasbor. Update status secara real-time: Baru → Diproses → Dikirim → Selesai.',
        bullets: [
          'Filter & cari pesanan dengan cepat',
          'Riwayat pesanan tersimpan rapi',
        ],
        iconBg: 'bg-sky-50',
        iconColor: 'text-sky-600',
      },
      {
        Icon: Truck,
        title: 'Estimasi Ongkir',
        description:
          'Panduan berat produk & referensi ongkir untuk penjual dan pembeli. (Integrasi kurir otomatis segera hadir)',
        bullets: [
          'Input berat & dimensi produk',
          'Tampilan info ongkir di halaman toko',
        ],
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
      },
    ],
  },
  {
    id: 'analitik',
    badge: 'Analisis & Pertumbuhan',
    badgeColor: 'text-violet-600',
    title: 'Analisis & Pertumbuhan',
    description:
      'Data nyata untuk keputusan bisnis yang lebih cerdas. Pahami pelanggan dan optimalkan konversi penjualan Anda.',
    bg: 'bg-white',
    isAnalytics: true,
    features: [
      {
        Icon: BarChart2,
        title: 'Ringkasan Performa',
        description:
          'Pantau jumlah kunjungan, klik produk, dan konversi ke WhatsApp dalam satu tampilan sederhana.',
        bullets: [
          'Grafik kunjungan & klik per periode',
          'Produk paling diminati',
          'Tren performa harian/mingguan',
        ],
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-600',
      },
      {
        Icon: Activity,
        title: 'Pelacakan Konversi',
        description:
          'Ketahui berapa persen pengunjung yang benar-benar mengirim pesan ke WhatsApp Anda.',
        bullets: [
          'Rasio klik vs order per produk',
          'Sumber traffic (link langsung)',
        ],
        iconBg: 'bg-primary-50',
        iconColor: 'text-primary-600',
      },
      {
        Icon: TrendingUp,
        title: 'Simulasi Penghematan',
        description:
          'Hitung perkiraan hemat biaya admin vs marketplace berdasarkan omzet bulanan Anda.',
        bullets: [
          'Slider interaktif',
          'Perbandingan biaya transparan',
        ],
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
      },
    ],
  },
  {
    id: 'teknologi',
    badge: 'Teknologi & Keandalan',
    badgeColor: 'text-sky-600',
    title: 'Teknologi & Keandalan',
    description:
      'Infrastruktur kelas enterprise di balik antarmuka yang sederhana — uptime 99.9% untuk toko Anda setiap hari.',
    bg: 'bg-gray-50',
    features: [
      {
        Icon: Smartphone,
        title: 'Progressive Web App (PWA)',
        description:
          'Toko bisa di-install di HP pembeli seperti aplikasi native, lengkap dengan akses offline untuk katalog.',
        bullets: [
          'Install tanpa App Store / Play Store',
          'Cache katalog untuk akses offline',
          'Notifikasi push (segera hadir)',
        ],
        iconBg: 'bg-sky-50',
        iconColor: 'text-sky-600',
      },
      {
        Icon: Layers,
        title: 'Kompresi Gambar Otomatis',
        description:
          'Foto produk diproses via Cloudinary → dikompresi dan disajikan format terbaik (WebP/AVIF) via CDN global.',
        bullets: [
          'Upload JPEG/PNG → otomatis optimal',
          'Ukuran file lebih ringan hingga 70%',
          'Load cepat dari mana saja',
        ],
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
      },
      {
        Icon: ShieldCheck,
        title: 'Keamanan & Akses',
        description:
          'Sistem akses berlapis: pemilik, admin, dan staf memiliki izin yang berbeda. Data terenkripsi dan aman.',
        bullets: [
          'JWT authentication standar industri',
          'Enkripsi HTTPS standar industri',
          'Snapshot data berkala',
        ],
        iconBg: 'bg-rose-50',
        iconColor: 'text-rose-500',
      },
    ],
  },
];

/* ── Feature Card ────────────────────────────────────────── */

function FeatureCard({ Icon, title, description, bullets, iconBg, iconColor }) {
  return (
    <div className="flex flex-col p-6 rounded-2xl bg-gray-50 border border-transparent hover:bg-white hover:border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div
        className={`h-11 w-11 rounded-xl ${iconBg} flex items-center justify-center mb-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
      >
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-4">{description}</p>
      <ul className="mt-auto space-y-2">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */

export default function Fitur() {
  return (
    <div className="flex flex-col w-full">

      {/* ── Category Sections ────────────────────────────── */}
      {categories.map((cat) => (
        <section
          key={cat.id}
          id={cat.id}
          className={`py-20 px-4 sm:px-6 lg:px-8 ${cat.bg}`}
        >
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-12 max-w-2xl">
              <span className={`text-xs font-bold uppercase tracking-[0.15em] ${cat.badgeColor}`}>
                {cat.badge}
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">{cat.title}</h2>
              <p className="mt-3 text-gray-500 leading-relaxed">{cat.description}</p>
            </div>

            {/* Feature Grid */}
            {cat.isAnalytics ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cat.features.map((feat) => (
                    <FeatureCard key={feat.title} {...feat} />
                  ))}
                </div>
                <RoiCalculator />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.features.map((feat) => (
                  <FeatureCard key={feat.title} {...feat} />
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Coba Fitur Dasar — Gratis 100%
          </h2>
          <p className="text-primary-200 text-lg font-light">
            Tidak perlu kartu kredit. Tidak perlu pasang aplikasi.
            Toko Anda online dalam hitungan menit.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl text-base px-10 group"
            >
              Buat Toko Online Sekarang
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full border-t border-white/20 pt-6 mt-2">
            {[
              { val: '0%', label: 'Komisi Per Transaksi' },
              { val: '5 menit', label: 'Waktu setup toko' },
              { val: '99.9%', label: 'Uptime dijamin' },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span className="text-2xl font-extrabold text-white">{val}</span>
                <span className="text-sm text-primary-200">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
