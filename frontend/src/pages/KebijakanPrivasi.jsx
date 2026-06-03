import React from 'react';
import SEO from '../components/seo/SEO';
import FadeInSection from '../components/ui/FadeInSection';
import LegalPageLayout from '../components/layout/LegalPageLayout';

const sections = [
  { id: 'informasi-yang-dikumpulkan', title: '1. Informasi yang Kami Kumpulkan' },
  { id: 'bagaimana-kami-menggunakan-data', title: '2. Bagaimana Kami Menggunakan Data' },
  { id: 'berbagi-data-pihak-ketiga', title: '3. Berbagi Data dengan Pihak Ketiga' },
  { id: 'hak-pengguna', title: '4. Hak Pengguna' },
  { id: 'cookie-dan-pelacakan', title: '5. Cookie dan Pelacakan' },
];

export default function KebijakanPrivasi() {
  return (
    <>
      <SEO
        title="Kebijakan Privasi"
        description="Pelajari bagaimana Untung Utuh mengumpulkan, menggunakan, dan melindungi data pribadi Anda sesuai dengan peraturan perlindungan data yang berlaku."
        url="/kebijakan-privasi"
      />

      <FadeInSection>
        <LegalPageLayout
          badge="Kebijakan Privasi"
          title="Kebijakan Privasi"
          subtitle="Dokumen ini menjelaskan bagaimana Untung Utuh mengelola dan melindungi data pribadi Anda saat menggunakan platform kami."
          lastUpdated="4 Juni 2026"
          sections={sections}
        >
          {/* ── 1. Informasi yang Kami Kumpulkan ─────────────── */}
          <FadeInSection delay={100}>
          <h2 id="informasi-yang-dikumpulkan" data-section-id="informasi-yang-dikumpulkan">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p>
            Kami mengumpulkan informasi yang Anda berikan secara langsung maupun yang diperoleh
            secara otomatis saat Anda menggunakan platform Untung Utuh. Informasi ini diperlukan
            untuk menyediakan layanan toko online yang optimal dan aman.
          </p>

          <h3>Data Akun</h3>
          <p>
            Saat Anda mendaftar, kami mengumpulkan data berikut untuk membuat dan mengelola akun
            Anda:
          </p>
          <ul>
            <li><strong>Nama lengkap</strong> — digunakan untuk identifikasi akun dan komunikasi.</li>
            <li><strong>Alamat email</strong> — digunakan untuk verifikasi akun, notifikasi, dan pemulihan kata sandi.</li>
            <li><strong>Kata sandi</strong> — disimpan dalam bentuk <em>hash</em> (terenkripsi satu arah) menggunakan algoritma bcrypt. Kami tidak pernah menyimpan kata sandi dalam bentuk teks asli.</li>
          </ul>

          <h3>Data Toko</h3>
          <p>
            Untuk mengaktifkan dan mengelola toko online Anda, kami mengumpulkan:
          </p>
          <ul>
            <li><strong>Nama toko</strong> — akan menjadi identitas toko Anda di platform.</li>
            <li><strong>Deskripsi toko</strong> — profil singkat tentang usaha Anda.</li>
            <li><strong>Data produk</strong> — termasuk nama produk, harga, deskripsi, foto, dan stok yang Anda unggah.</li>
          </ul>

          <h3>Data Teknis</h3>
          <p>
            Secara otomatis, kami mengumpulkan data teknis saat Anda mengakses platform:
          </p>
          <ul>
            <li><strong>Alamat IP</strong> — digunakan untuk keamanan dan analitik geografis agregat.</li>
            <li><strong>Informasi perangkat</strong> — tipe perangkat, sistem operasi, dan browser yang digunakan.</li>
            <li><strong>Data penggunaan</strong> — halaman yang dikunjungi, durasi sesi, dan interaksi dengan fitur platform.</li>
          </ul>

          </FadeInSection>

          {/* ── 2. Bagaimana Kami Menggunakan Data ──────────── */}
          <FadeInSection delay={150}>
          <h2 id="bagaimana-kami-menggunakan-data" data-section-id="bagaimana-kami-menggunakan-data">
            2. Bagaimana Kami Menggunakan Data
          </h2>
          <p>
            Data yang kami kumpulkan digunakan secara eksklusif untuk tujuan berikut:
          </p>

          <h3>Menyediakan Layanan</h3>
          <ul>
            <li>Membuat dan mengelola akun serta toko online Anda.</li>
            <li>Menampilkan halaman toko dan produk kepada pengunjung.</li>
            <li>Memproses pesanan dan mengirimkan notifikasi terkait transaksi melalui WhatsApp.</li>
          </ul>

          <h3>Meningkatkan Fitur</h3>
          <ul>
            <li>Menganalisis pola penggunaan untuk meningkatkan pengalaman pengguna.</li>
            <li>Mengembangkan fitur baru berdasarkan kebutuhan pengguna.</li>
            <li>Mengoptimalkan performa dan kecepatan platform.</li>
          </ul>

          <h3>Komunikasi &amp; Dukungan</h3>
          <ul>
            <li>Mengirimkan pembaruan penting terkait layanan (bukan spam promosi).</li>
            <li>Menanggapi pertanyaan dan permintaan dukungan dari pengguna.</li>
            <li>Memberikan notifikasi terkait perubahan kebijakan atau ketentuan layanan.</li>
          </ul>

          </FadeInSection>

          {/* ── 3. Berbagi Data dengan Pihak Ketiga ─────────── */}
          <FadeInSection delay={200}>
          <h2 id="berbagi-data-pihak-ketiga" data-section-id="berbagi-data-pihak-ketiga">
            3. Berbagi Data dengan Pihak Ketiga
          </h2>
          <p>
            <strong>Kami TIDAK menjual data pribadi Anda kepada pihak mana pun.</strong> Data Anda
            hanya dibagikan kepada vendor esensial yang diperlukan untuk menjalankan platform:
          </p>

          <h3>Cloudinary (Hosting Gambar)</h3>
          <p>
            Foto produk dan gambar toko Anda disimpan dan dioptimalkan melalui Cloudinary, penyedia
            layanan cloud image hosting terkemuka. Cloudinary hanya menerima data gambar dan tidak
            memiliki akses ke data pribadi akun Anda.
          </p>

          <h3>MongoDB Atlas (Database)</h3>
          <p>
            Seluruh data aplikasi disimpan di MongoDB Atlas, layanan database cloud terkelola dengan
            standar keamanan industri, termasuk enkripsi data saat istirahat (<em>at-rest</em>) dan
            saat transit (<em>in-transit</em>).
          </p>

          <h3>Vendor Pendukung Lainnya</h3>
          <ul>
            <li>VPS/hosting server — untuk menjalankan aplikasi backend.</li>
            <li>Layanan email transaksional — untuk pengiriman email verifikasi dan notifikasi.</li>
          </ul>
          <p>
            Seluruh vendor yang kami gunakan telah diverifikasi kepatuhannya terhadap standar
            perlindungan data dan tidak diizinkan menggunakan data Anda di luar keperluan layanan.
          </p>

          </FadeInSection>

          {/* ── 4. Hak Pengguna ─────────────────────────────── */}
          <FadeInSection delay={250}>
          <h2 id="hak-pengguna" data-section-id="hak-pengguna">
            4. Hak Pengguna
          </h2>
          <p>
            Sebagai pengguna platform Untung Utuh, Anda memiliki hak-hak berikut terkait data
            pribadi Anda:
          </p>

          <h3>Hak Akses</h3>
          <p>
            Anda berhak mengetahui data apa saja yang kami simpan tentang Anda. Informasi ini dapat
            diakses kapan saja melalui halaman dashboard akun Anda.
          </p>

          <h3>Hak Memperbarui</h3>
          <p>
            Anda dapat memperbarui data akun (nama, email, kata sandi) kapan saja melalui pengaturan
            akun. Data toko dan produk dapat dikelola langsung dari dashboard.
          </p>

          <h3>Hak Menghapus</h3>
          <p>
            Anda berhak menghapus akun dan seluruh data terkait kapan saja. Permintaan penghapusan
            akan diproses dalam waktu maksimal 7×24 jam. Beberapa data mungkin tetap tersimpan dalam
            cadangan (<em>backup</em>) untuk periode terbatas sesuai kebijakan retensi teknis.
          </p>

          <h3>Hak Menolak Pemrosesan</h3>
          <p>
            Anda dapat menolak pengumpulan data teknis (seperti cookie analitik) melalui pengaturan
            browser. Namun, data dasar yang diperlukan untuk menjalankan platform tidak dapat
            dikecualikan.
          </p>

          </FadeInSection>

          {/* ── 5. Cookie dan Pelacakan ──────────────────────── */}
          <FadeInSection delay={300}>
          <h2 id="cookie-dan-pelacakan" data-section-id="cookie-dan-pelacakan">
            5. Cookie dan Pelacakan
          </h2>
          <p>
            Kami menggunakan cookie secara minimal dan hanya untuk kepentingan analitik internal.
            Berikut adalah jenis cookie yang digunakan:
          </p>

          <h3>Cookie Fungsional</h3>
          <p>
            Diperlukan untuk menjaga sesi login dan preferensi dasar pengguna selama menggunakan
            platform. Cookie ini tidak dapat dimatikan karena diperlukan agar platform berfungsi.
          </p>

          <h3>Cookie Analitik Internal</h3>
          <p>
            Kami menggunakan data agregat untuk memahami bagaimana pengguna berinteraksi dengan
            platform. Data ini sepenuhnya anonim dan tidak dapat dilacak kembali ke individu
            tertentu. Kami tidak menggunakan cookie pelacakan dari pihak ketiga untuk iklan atau
            profiling.
          </p>

          <h3>Kontrol Cookie</h3>
          <p>
            Anda dapat mengatur preferensi cookie melalui pengaturan browser masing-masing. Namun,
            menonaktifkan cookie fungsional dapat memengaruhi kinerja dan akses ke beberapa fitur
            platform.
          </p>
          </FadeInSection>
        </LegalPageLayout>
      </FadeInSection>
    </>
  );
}
