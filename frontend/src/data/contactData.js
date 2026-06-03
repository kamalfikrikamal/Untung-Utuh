/**
 * Data konfigurasi untuk halaman Kontak (/kontak).
 * Semua teks, opsi dropdown, FAQ, dan info kontak dipusatkan di sini
 * agar mudah di-maintain tanpa menyentuh komponen React.
 */

export const contactInfo = [
  {
    id: 'email',
    icon: 'Mail',
    title: 'Email Support',
    value: 'support@untungutuh.com',
    href: 'mailto:support@untungutuh.com',
    description: 'Untuk pertanyaan umum & teknis',
  },
  {
    id: 'whatsapp',
    icon: 'Phone',
    title: 'WhatsApp Business',
    value: '+62 812-3456-7890',
    href: 'https://wa.me/6281234567890',
    description: 'Chat langsung untuk respons lebih cepat',
  },
  {
    id: 'hours',
    icon: 'Clock',
    title: 'Jam Operasional',
    value: 'Senin - Jumat, 09.00 - 17.00 WIB',
    href: null,
    description: 'Kami libur pada hari Sabtu, Minggu, dan tanggal merah',
  },
];

export const subjectOptions = [
  { value: '', label: 'Pilih subjek pesan', disabled: true },
  { value: 'general', label: 'Pertanyaan Umum' },
  { value: 'technical', label: 'Dukungan Teknis' },
  { value: 'partnership', label: 'Partnership/Kerjasama' },
  { value: 'feedback', label: 'Feedback & Saran' },
  { value: 'other', label: 'Lainnya' },
];

export const businessCategoryOptions = [
  { value: '', label: 'Pilih kategori (opsional)', disabled: true },
  { value: 'kuliner', label: 'Kuliner' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'kerajinan', label: 'Kerajinan' },
  { value: 'elektronik', label: 'Elektronik' },
  { value: 'jasa', label: 'Jasa' },
  { value: 'lainnya', label: 'Lainnya' },
];

export const faqItems = [
  {
    id: 'setup',
    question: 'Berapa lama setup toko?',
    answer:
      'Setup toko sangat cepat! Setelah registrasi, Anda bisa langsung mengakses dashboard dan mulai menambahkan produk. Rata-rata pengguna berhasil menyelesaikan setup awal dalam waktu kurang dari 10 menit. Prosesnya sudah otomatis dan tidak perlu coding.',
  },
  {
    id: 'hidden-fees',
    question: 'Apakah ada biaya tersembunyi?',
    answer:
      'Tidak ada biaya tersembunyi sama sekali. Paket Gratis benar-benar gratis tanpa batas waktu. Paket berbayar (Pro & Premium) hanya dikenakan biaya langganan bulanan/tahunan yang sudah disebutkan di halaman harga. Tidak ada komisi per transaksi atau biaya tambahan lainnya.',
  },
  {
    id: 'upgrade',
    question: 'Bagaimana cara upgrade paket?',
    answer:
      'Upgrade paket bisa dilakukan kapan saja dari halaman Pengaturan Akun di dashboard. Perubahan akan berlaku segera setelah pembayaran dikonfirmasi. Anda juga bisa downgrade atau membatalkan langganan kapan pun tanpa penalti.',
  },
  {
    id: 'data-security',
    question: 'Apakah data saya aman?',
    answer:
      'Keamanan data adalah prioritas utama kami. Semua data disimpan dengan enkripsi SSL/TLS, server kami diaudit secara rutin, dan kami menerapkan praktik keamanan industri standar. Kami juga tidak pernah membagikan data Anda ke pihak ketiga tanpa izin.',
  },
  {
    id: 'trial',
    question: 'Bisa trial dulu sebelum bayar?',
    answer:
      'Tentu! Paket Gratis kami sudah bisa digunakan untuk mencoba seluruh fitur dasar tanpa batas waktu. Tidak perlu komitmen atau kartu kredit. Jika sudah siap, Anda bisa upgrade ke paket Pro atau Premium kapan saja.',
  },
];

export const communityLinks = [
  {
    label: 'Grup WhatsApp Seller',
    href: 'https://wa.me/6281234567890?text=Halo%20saya%20ingin%20bergabung%20grup%20WhatsApp%20seller',
    icon: 'MessageCircle',
  },
  {
    label: 'Facebook Group',
    href: 'https://facebook.com/groups/untungutuh',
    icon: 'Facebook',
  },
];

export const successMessage =
  'Terima kasih! Pesan Anda telah terkirim. Kami akan segera membalas dalam 1x24 jam.';

export const seo = {
  title: 'Hubungi Kami - Untung Utuh',
  description:
    'Butuh bantuan? Tim support Untung Utuh siap membantu Anda via email, WhatsApp, atau formulir kontak. Respons cepat dan ramah.',
  url: '/kontak',
};
