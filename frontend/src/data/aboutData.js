/**
 * aboutData.js — Centralized configuration for the /tentang-kami page.
 * All text, stats, values, and team data are maintained here.
 */

/* ── Hero Section ──────────────────────────────────────── */

export const hero = {
  badge: 'Sejak 2024',
  badgeColor: 'bg-emerald-100 text-emerald-700',
  title: 'Membantu UMKM Indonesia Go Digital',
  subtitle:
    'Kami percaya setiap penjual lokal berhak memiliki toko online sendiri — tanpa potongan 8–15% dari marketplace, tanpa biaya tersembunyi, dan dengan kontrol penuh atas data serta pelanggan mereka.',
  stats: [
    { label: 'Dipercaya', value: '1,247+', unit: 'UMKM' },
    { label: 'Total Penghematan', value: 'Rp 2.3M+', unit: 'biaya admin' },
    { label: 'Kepuasan', value: '99.9%', unit: 'pengguna' },
  ],
};

/* ── Cerita Kami ────────────────────────────────────────── */

export const story = {
  title: 'Cerita Kami',
  subtitle: 'Dari keprihatinan menjadi solusi nyata.',
  paragraphs: [
    'Untung Utuh lahir dari pengalaman langsung melihat teman dan keluarga yang berjualan di marketplace besar. Setiap bulan, mereka harus merelakan 8–15% dari pendapatan hanya untuk biaya admin dan potongan platform — belum lagi ongkos iklan yang terus naik. Margin yang tipis makin tergerus, sementara data pelanggan tetap menjadi milik marketplace.',
    'Kami bertanya: mengapa tidak ada platform yang benar-benar berpihak pada UMKM? Platform yang transparan, tanpa biaya tersembunyi, dan memberikan kontrol penuh atas data serta hubungan dengan pelanggan?',
    'Dari situlah Untung Utuh hadir. Kami membangun toko online yang ringan, cepat, dan mudah digunakan — tanpa komisi per transaksi, tanpa iklan paksa, dan tanpa lock-in. Cukup bayar langganan flat (atau gunakan gratis), dan Anda memiliki toko online sendiri dengan domain khusus, siap menerima pesanan lewat WhatsApp dalam hitungan menit.',
  ],
  imageAlt: 'Ilustrasi tim dan UMKM binaan Untung Utuh',
};

/* ── Visi & Misi ────────────────────────────────────────── */

export const visionMission = [
  {
    icon: 'Target',
    title: 'Visi Kami',
    highlight: 'Menjadi platform toko online #1 untuk UMKM Indonesia',
    description:
      'Menciptakan ekosistem digital yang inklusif di mana setiap UMKM Indonesia — dari pelosok desa hingga pusat kota — dapat bersaing secara setara di era digital tanpa terbebani biaya tinggi.',
  },
  {
    icon: 'Heart',
    title: 'Misi Kami',
    highlight: 'Memberdayakan 1 juta UMKM go digital dengan biaya terjangkau',
    description:
      'Menyediakan infrastruktur toko online yang sederhana, terjangkau, dan powerful sehingga UMKM dapat fokus pada produk dan pelayanan — bukan pusing dengan teknis atau potongan biaya.',
  },
  {
    icon: 'Eye',
    title: 'Nilai Utama',
    highlight: 'Transparansi, Kemudahan, Keberpihakan',
    description:
      'Tiga pilar yang menuntun setiap keputusan kami. Tidak ada biaya tersembunyi, tidak ada algoritma yang merugikan penjual, dan tidak ada batasan teknis yang menghalangi.',
  },
];

/* ── Nilai-Nilai Kami ───────────────────────────────────── */

export const values = [
  {
    icon: 'ShieldCheck',
    title: 'Transparansi',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    tagline: '0% komisi per transaksi, biaya flat jelas',
    description:
      'Kami tidak mengambil potongan dari setiap transaksi Anda. Cukup satu biaya langganan yang disebutkan di awal — tanpa biaya tersembunyi, tanpa kenaikan harga diam-diam. Apa yang Anda lihat, itulah yang Anda bayar.',
  },
  {
    icon: 'Zap',
    title: 'Kemudahan',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    tagline: 'Setup <5 menit, tanpa teknis rumit',
    description:
      'Cukup daftar, upload produk, dan toko Anda langsung online. Tidak perlu mengurus hosting, domain, atau coding. Semua sudah kami siapkan agar Anda bisa langsung fokus berjualan.',
  },
  {
    icon: 'Users',
    title: 'Keberpihakan',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    tagline: '100% fokus pada kebutuhan UMKM, bukan investor',
    description:
      'Setiap fitur yang kami buat didasarkan pada kebutuhan nyata UMKM, bukan tekanan investor atau target pertumbuhan. Data Anda milik Anda, dan pelanggan Anda adalah pelanggan Anda sepenuhnya.',
  },
  {
    icon: 'Lightbulb',
    title: 'Inovasi',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    tagline: 'Teknologi terbaru, PWA, AI-ready',
    description:
      'Kami menggunakan teknologi web modern (React 19, PWA, Tailwind CSS) untuk memastikan toko online Anda cepat, dapat diakses offline, dan siap mengadopsi kecerdasan buatan di masa depan — tanpa perlu upgrade mahal.',
  },
];

/* ── Impact Statistik ───────────────────────────────────── */

export const impactStats = [
  {
    value: '1,247+',
    label: 'UMKM Bergabung',
    suffix: 'UMKM',
    description:
      'Tersebar di seluruh Indonesia, dari Aceh hingga Papua, dari kuliner hingga fashion.',
  },
  {
    value: 'Rp 2.3M+',
    label: 'Total Penghematan Biaya Admin',
    suffix: 'rupiah',
    description:
      'Gabungan penghematan dari komisi marketplace yang tidak perlu dibayar oleh para seller.',
  },
  {
    value: '99.9%',
    label: 'Kepuasan Pengguna',
    suffix: 'rating',
    description:
      'Berdasarkan survei internal dan feedback langsung dari komunitas seller WhatsApp kami.',
  },
];

/* ── Tim Kami ───────────────────────────────────────────── */

export const team = [
  {
    name: 'Ahmad Fauzi',
    initials: 'AF',
    role: 'Founder & CEO',
    description: 'Mantan penjual marketplace yang muak dengan potongan 15%. Kini bertekad membebaskan UMKM dari biaya tinggi.',
    color: 'bg-emerald-500',
  },
  {
    name: 'Rina Wijaya',
    initials: 'RW',
    role: 'Lead Developer',
    description: 'Full-stack engineer dengan passion di PWA dan performa web. Memastikan setiap toko online loading <2 detik.',
    color: 'bg-blue-500',
  },
  {
    name: 'Doni Prasetyo',
    initials: 'DP',
    role: 'Product Designer',
    description: 'UX Designer yang percaya bahwa kemudahan adalah hak setiap UMKM. Mendesain dashboard yang simpel dan intuitif.',
    color: 'bg-amber-500',
  },
];

/* ── Mitra & Komunitas ──────────────────────────────────── */

export const partners = [
  {
    name: 'Cloudinary',
    alt: 'Cloudinary — Optimasi Gambar & Video',
    badge: 'Image Optimization Partner',
  },
  {
    name: 'MongoDB',
    alt: 'MongoDB — Database Platform',
    badge: 'Database Partner',
  },
  {
    name: 'Vercel',
    alt: 'Vercel — Frontend Deployment',
    badge: 'Deployment Partner',
  },
];

/* ── CTA Section ────────────────────────────────────────── */

export const cta = {
  title: 'Jadilah Bagian dari Perubahan',
  subtitle:
    'Bergabung dengan ribuan UMKM yang sudah merasakan kebebasan berjualan online tanpa potongan biaya marketplace.',
  buttonText: 'Mulai Gratis Sekarang',
  buttonLink: '/register',
  trustBadges: [
    'Tanpa Kartu Kredit',
    'Setup 5 Menit',
    'Garansi 7 Hari',
  ],
};

/* ── SEO ────────────────────────────────────────────────── */

export const seo = {
  title: 'Tentang Kami',
  description:
    'Misi kami membantu UMKM Indonesia go digital dengan biaya transparan dan teknologi modern. Bergabung dengan 1,247+ UMKM yang sudah merasakan kebebasan berjualan online.',
  url: '/tentang-kami',
};
