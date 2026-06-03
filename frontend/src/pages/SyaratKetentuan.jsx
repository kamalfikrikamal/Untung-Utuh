import React from 'react';
import SEO from '../components/seo/SEO';
import FadeInSection from '../components/ui/FadeInSection';
import LegalPageLayout from '../components/layout/LegalPageLayout';

const sections = [
  { id: 'penerimaan-syarat', title: '1. Penerimaan Syarat' },
  { id: 'pendaftaran-akun', title: '2. Pendaftaran Akun' },
  { id: 'kewajiban-pengguna', title: '3. Kewajiban Pengguna' },
  { id: 'larangan', title: '4. Larangan' },
  { id: 'pembatasan-tanggung-jawab', title: '5. Pembatasan Tanggung Jawab' },
  { id: 'perubahan-ketentuan', title: '6. Perubahan Ketentuan' },
];

export default function SyaratKetentuan() {
  return (
    <>
      <SEO
        title="Syarat & Ketentuan"
        description="Syarat dan ketentuan penggunaan platform Untung Utuh. Baca sebelum menggunakan layanan toko online kami."
        url="/syarat-ketentuan"
      />

      <FadeInSection>
        <LegalPageLayout
          badge="Syarat & Ketentuan"
          title="Syarat &amp; Ketentuan"
          subtitle="Dengan mengakses dan menggunakan platform Untung Utuh, Anda menyetujui syarat dan ketentuan yang diuraikan dalam dokumen ini."
          lastUpdated="4 Juni 2026"
          sections={sections}
        >
          {/* ── 1. Penerimaan Syarat ─────────────────────────── */}
          <FadeInSection delay={100}>
          <h2 id="penerimaan-syarat" data-section-id="penerimaan-syarat">
            1. Penerimaan Syarat
          </h2>
          <p>
            Dengan mengakses, mendaftar, atau menggunakan platform Untung Utuh ("Layanan"), Anda
            menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh seluruh syarat
            dan ketentuan yang tercantum dalam dokumen ini.
          </p>
          <p>
            Jika Anda tidak menyetujui salah satu bagian dari syarat dan ketentuan ini, Anda tidak
            diizinkan untuk mengakses atau menggunakan Layanan. Penggunaan Layanan secara terus
            menerus setelah perubahan ketentuan dianggap sebagai penerimaan Anda terhadap perubahan
            tersebut.
          </p>

          </FadeInSection>

          {/* ── 2. Pendaftaran Akun ──────────────────────────── */}
          <FadeInSection delay={150}>
          <h2 id="pendaftaran-akun" data-section-id="pendaftaran-akun">
            2. Pendaftaran Akun
          </h2>
          <p>
            Untuk menggunakan Layanan sebagai penjual, Anda diwajibkan mendaftar dan membuat akun.
            Dengan mendaftar, Anda menjamin bahwa:
          </p>
          <ul>
            <li>Anda berusia <strong>minimal 17 tahun</strong> atau memiliki kapasitas hukum untuk mengikatkan diri dalam perjanjian ini.</li>
            <li>Seluruh informasi yang Anda berikan saat pendaftaran adalah <strong>benar, akurat, dan terkini</strong>.</li>
            <li>Anda bertanggung jawab penuh untuk menjaga kerahasiaan kata sandi akun Anda.</li>
            <li>Anda bertanggung jawab atas segala aktivitas yang terjadi di bawah akun Anda.</li>
          </ul>
          <p>
            Kami berhak untuk menolak pendaftaran, menangguhkan, atau menghapus akun jika ditemukan
            pelanggaran terhadap ketentuan ini atau indikasi aktivitas yang mencurigakan.
          </p>

          </FadeInSection>

          {/* ── 3. Kewajiban Pengguna ────────────────────────── */}
          <FadeInSection delay={200}>
          <h2 id="kewajiban-pengguna" data-section-id="kewajiban-pengguna">
            3. Kewajiban Pengguna
          </h2>
          <p>
            Sebagai pengguna platform Untung Utuh, Anda setuju untuk:
          </p>

          <h3>Menjual Barang Legal</h3>
          <ul>
            <li>Hanya menjual barang dan/atau jasa yang legal sesuai dengan hukum dan peraturan yang berlaku di Republik Indonesia.</li>
            <li>Tidak menjual barang terlarang seperti narkotika, senjata ilegal, konten bajakan, atau produk yang melanggar hak kekayaan intelektual pihak lain.</li>
          </ul>

          <h3>Larangan Spam &amp; Penipuan</h3>
          <ul>
            <li>Tidak melakukan spam, phishing, atau aktivitas penipuan dalam bentuk apa pun.</li>
            <li>Tidak menggunakan platform untuk mengirimkan informasi palsu atau menyesatkan kepada pengguna lain.</li>
          </ul>

          <h3>Deskripsi Produk</h3>
          <ul>
            <li>Bertanggung jawab penuh atas keakuratan deskripsi, harga, foto, dan informasi lain dari produk yang Anda jual.</li>
            <li>Memastikan bahwa deskripsi produk tidak melanggar hak pihak ketiga atau mengandung konten yang dilarang.</li>
          </ul>

          <h3>Transaksi &amp; Pengiriman</h3>
          <ul>
            <li>Memproses pesanan yang diterima dengan itikad baik dan tepat waktu.</li>
            <li>Berkomunikasi secara profesional dengan pembeli melalui WhatsApp atau saluran yang disepakati.</li>
          </ul>

          </FadeInSection>

          {/* ── 4. Larangan ──────────────────────────────────── */}
          <FadeInSection delay={250}>
          <h2 id="larangan" data-section-id="larangan">
            4. Larangan
          </h2>
          <p>
            Anda dilarang keras untuk melakukan hal-hal berikut:
          </p>
          <ul>
            <li><strong>Reverse Engineering</strong> — Mendekompilasi, merekayasa balik, atau membongkar kode sumber platform Untung Utuh dalam bentuk apa pun.</li>
            <li><strong>Menyalahgunakan API</strong> — Mengakses atau menggunakan API platform di luar batas kewajaran, termasuk melakukan <em>scraping</em> data massal atau otomatisasi yang mengganggu layanan.</li>
            <li><strong>Gangguan Sistem</strong> — Mengirim virus, <em>malware</em>, atau kode berbahaya lainnya yang dapat merusak atau mengganggu infrastruktur platform.</li>
            <li><strong>Pelanggaran Keamanan</strong> — Mencoba mengakses akun pengguna lain, menembus sistem keamanan, atau mengeksploitasi kerentanan platform tanpa izin.</li>
            <li><strong>Penyalahgunaan Merek</strong> — Menggunakan nama, logo, atau merek dagang Untung Utuh tanpa izin tertulis sebelumnya.</li>
          </ul>

          </FadeInSection>

          {/* ── 5. Pembatasan Tanggung Jawab ──────────────────── */}
          <FadeInSection delay={300}>
          <h2 id="pembatasan-tanggung-jawab" data-section-id="pembatasan-tanggung-jawab">
            5. Pembatasan Tanggung Jawab
          </h2>
          <p>
            Platform Untung Utuh menyediakan alat dan infrastruktur untuk membantu Anda membuat dan
            mengelola toko online. Dengan menggunakan Layanan, Anda memahami dan menyetujui bahwa:
          </p>
          <ul>
            <li>Untung Utuh hanyalah <strong>penyedia alat platform</strong> dan tidak terlibat langsung dalam transaksi jual-beli antara penjual dan pembeli.</li>
            <li>Setiap sengketa dagang, termasuk namun tidak terbatas pada masalah kualitas produk, pengiriman, pembayaran, atau komplain pembeli, <strong>merupakan tanggung jawab penjual dan pembeli</strong> untuk diselesaikan secara langsung.</li>
            <li>Kami tidak bertanggung jawab atas kerugian yang timbul akibat penggunaan platform di luar kendali kami, termasuk gangguan layanan pihak ketiga atau <em>force majeure</em>.</li>
            <li>Layanan disediakan "apa adanya" (<em>as is</em>) tanpa jaminan tersurat maupun tersirat, kecuali diwajibkan oleh hukum yang berlaku.</li>
          </ul>

          </FadeInSection>

          {/* ── 6. Perubahan Ketentuan ────────────────────────── */}
          <FadeInSection delay={350}>
          <h2 id="perubahan-ketentuan" data-section-id="perubahan-ketentuan">
            6. Perubahan Ketentuan
          </h2>
          <p>
            Kami berhak untuk mengubah, memodifikasi, atau memperbarui Syarat &amp; Ketentuan ini
            sewaktu-waktu. Perubahan akan diberlakukan dengan cara:
          </p>
          <ul>
            <li>Memberitahukan melalui email atau notifikasi dalam platform untuk perubahan material.</li>
            <li>Mencantumkan tanggal "Terakhir diperbarui" di bagian atas halaman ini.</li>
            <li>Penggunaan Layanan secara terus-menerus setelah perubahan diberlakukan merupakan bentuk persetujuan Anda terhadap ketentuan yang baru.</li>
          </ul>
          <p>
            Kami menyarankan Anda untuk meninjau halaman ini secara berkala agar selalu mengetahui
            ketentuan terbaru. Jika Anda tidak menyetujui perubahan yang dibuat, Anda dapat
            menghentikan penggunaan Layanan dan menghapus akun Anda kapan saja.
          </p>
          </FadeInSection>
        </LegalPageLayout>
      </FadeInSection>
    </>
  );
}
