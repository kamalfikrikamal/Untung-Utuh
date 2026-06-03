import React from 'react';
import SEO from '../components/seo/SEO';
import FadeInSection from '../components/ui/FadeInSection';
import LegalPageLayout from '../components/layout/LegalPageLayout';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Server,
  Building2,
  BadgeCheck,
} from 'lucide-react';

const sections = [
  { id: 'enkripsi-dan-proteksi', title: '1. Enkripsi & Proteksi' },
  { id: 'kontrol-akses', title: '2. Kontrol Akses' },
  { id: 'infrastruktur-dan-backup', title: '3. Infrastruktur & Backup' },
  { id: 'keamanan-pihak-ketiga', title: '4. Keamanan Pihak Ketiga' },
];

const securityBadges = [
  {
    Icon: Lock,
    label: 'TLS Encrypted',
    desc: 'HTTPS / Enkripsi SSL',
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    border: 'border-emerald-200',
  },
  {
    Icon: ShieldCheck,
    label: 'Secure Database',
    desc: 'Enkripsi data at-rest',
    bg: 'bg-sky-50',
    color: 'text-sky-600',
    border: 'border-sky-200',
  },
  {
    Icon: BadgeCheck,
    label: 'GDPR & PDP Compliant',
    desc: 'Standar perlindungan data',
    bg: 'bg-violet-50',
    color: 'text-violet-600',
    border: 'border-violet-200',
  },
];

export default function KeamananData() {
  return (
    <>
      <SEO
        title="Keamanan Data"
        description="Pelajari bagaimana Untung Utuh melindungi data Anda dengan enkripsi TLS, kontrol akses ketat, infrastruktur aman, dan kepatuhan terhadap standar keamanan."
        url="/keamanan-data"
      />

      <FadeInSection>
        <LegalPageLayout
          badge="Keamanan Data"
          title="Keamanan Data"
          subtitle="Kami serius dalam melindungi data Anda. Berkomitmen menerapkan standar keamanan tinggi di setiap lapisan platform Untung Utuh."
          lastUpdated="4 Juni 2026"
          sections={sections}
        >
          {/* ── 1. Enkripsi & Proteksi ───────────────────────── */}
          <FadeInSection delay={100}>
          <h2 id="enkripsi-dan-proteksi" data-section-id="enkripsi-dan-proteksi">
            1. Enkripsi &amp; Proteksi
          </h2>

          <h3>HTTPS / TLS untuk Transmisi Data</h3>
          <p>
            Seluruh komunikasi antara perangkat Anda dan server Untung Utuh dilindungi dengan
            protokol <strong>HTTPS/TLS 1.3</strong>. Ini memastikan bahwa data yang dikirim — baik
            saat login, upload produk, maupun akses halaman toko — terenkripsi dan tidak dapat
            dibaca oleh pihak ketiga selama transit.
          </p>
          <p>
            Sertifikat SSL kami diperbarui secara otomatis dan diaudit secara berkala untuk
            memastikan tidak ada celah keamanan pada lapisan transportasi.
          </p>

          <h3>Bcrypt untuk Hashing Password</h3>
          <p>
            Kata sandi akun Anda tidak pernah disimpan dalam bentuk teks asli. Kami menggunakan
            algoritma <strong>bcrypt</strong> dengan <em>salt rounds</em> yang memadai untuk
            menghasilkan hash satu arah. Bahkan jika data mengalami kebocoran, kata sandi Anda tetap
            aman dan tidak dapat direkayasa balik.
          </p>

          <h3>Enkripsi Data di Database</h3>
          <p>
            Data sensitif yang disimpan di database kami dienkripsi saat istirahat (<em>at-rest</em>)
            menggunakan enkripsi tingkat penyimpanan AES-256. Data cadangan juga dienkripsi dengan
            standar yang sama.
          </p>

          </FadeInSection>

          {/* ── 2. Kontrol Akses ─────────────────────────────── */}
          <FadeInSection delay={150}>
          <h2 id="kontrol-akses" data-section-id="kontrol-akses">
            2. Kontrol Akses
          </h2>

          <h3>Sistem Role-Based Access Control (RBAC)</h3>
          <p>
            Kami menerapkan sistem RBAC yang ketat. Setiap pengguna hanya memiliki akses ke data dan
            fitur yang sesuai dengan perannya:
          </p>
          <ul>
            <li><strong>Pengguna (Penjual)</strong> — hanya dapat mengakses dashboard tokonya sendiri, data produk, dan pengaturan akun pribadi.</li>
            <li><strong>Administrator</strong> — akses terbatas untuk kebutuhan operasional dan dukungan teknis, dengan catatan audit ketat.</li>
          </ul>

          <h3>JWT Authentication</h3>
          <p>
            Setiap permintaan ke API backend diverifikasi menggunakan <strong>JSON Web Token (JWT)</strong>.
            Token memiliki masa berlaku terbatas dan ditandatangani secara kriptografis untuk mencegah
            pemalsuan. Token yang kedaluwarsa atau mencurigakan akan langsung ditolak oleh sistem.
          </p>

          <h3>Rate Limiting &amp; Proteksi Brute Force</h3>
          <p>
            Kami menerapkan <em>rate limiting</em> pada endpoint login dan API untuk mencegah serangan
            <em>brute force</em>. Upaya login yang gagal berulang kali akan mengakibatkan pemblokiran
            sementara pada alamat IP yang bersangkutan.
          </p>

          </FadeInSection>

          {/* ── 3. Infrastruktur & Backup ─────────────────────── */}
          <FadeInSection delay={200}>
          <h2 id="infrastruktur-dan-backup" data-section-id="infrastruktur-dan-backup">
            3. Infrastruktur &amp; Backup
          </h2>

          <h3>Server Cloud Terpercaya</h3>
          <p>
            Platform Untung Utuh dijalankan di atas infrastruktur cloud terpercaya yang menyediakan
            sertifikasi keamanan tingkat industri. Server kami dilindungi dengan firewall, pemantauan
            intrusi 24/7, dan pembaruan keamanan rutin.
          </p>

          <h3>Backup Berkala</h3>
          <p>
            Data platform dicadangkan secara otomatis dengan jadwal berikut:
          </p>
          <ul>
            <li><strong>Backup harian</strong> — snapshot database setiap 24 jam.</li>
            <li><strong>Retensi</strong> — cadangan disimpan minimal 7 hari untuk pemulihan jika terjadi insiden.</li>
            <li><strong>Geo-redundancy</strong> — cadangan disimpan di lokasi geografis yang berbeda untuk mitigasi bencana.</li>
          </ul>

          <h3>Pemantauan &amp; Respons Insiden</h3>
          <p>
            Infrastruktur kami dipantau secara real-time dengan sistem peringatan otomatis. Tim teknis
            siap merespons insiden keamanan sesuai dengan prosedur tanggap darurat yang telah
            ditetapkan.
          </p>

          </FadeInSection>

          {/* ── 4. Keamanan Pihak Ketiga ──────────────────────── */}
          <FadeInSection delay={250}>
          <h2 id="keamanan-pihak-ketiga" data-section-id="keamanan-pihak-ketiga">
            4. Keamanan Pihak Ketiga
          </h2>
          <p>
            Kami hanya bekerja sama dengan vendor pihak ketiga yang telah terverifikasi dan mematuhi
            standar keamanan yang ketat:
          </p>

          <h3>Vendor Terverifikasi</h3>
          <ul>
            <li><strong>Cloudinary</strong> — penyedia hosting gambar dengan enkripsi HTTPS, sertifikasi SOC 2, dan kepatuhan GDPR.</li>
            <li><strong>MongoDB Atlas</strong> — database cloud dengan enkripsi at-rest AES-256, sertifikasi ISO 27001, SOC 1/2/3, dan PCI DSS.</li>
            <li><strong>VPS/Hosting</strong> — infrastruktur server dengan firewall, DDoS protection, dan pemantauan 24/7.</li>
          </ul>

          <h3>Data Minimization</h3>
          <p>
            Vendor pihak ketiga hanya menerima data minimum yang diperlukan untuk menjalankan layanan
            mereka. Kontrak dengan vendor mewajibkan mereka untuk tidak menggunakan data Anda di luar
            keperluan layanan yang telah disepakati.
          </p>

          <h3>Audit Berkala</h3>
          <p>
            Kepatuhan vendor terhadap standar keamanan ditinjau secara berkala. Kami memiliki hak
            untuk menghentikan kerja sama jika ditemukan pelanggaran keamanan atau ketidakpatuhan
            terhadap perjanjian perlindungan data.
          </p>

          </FadeInSection>

          {/* ── Security Badges ───────────────────────────────── */}
          <FadeInSection delay={300}>
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h3 className="text-base font-semibold text-gray-700 mb-6 text-center">
              Sertifikasi &amp; Standar Keamanan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {securityBadges.map(({ Icon, label, desc, bg, color, border }) => (
                <div
                  key={label}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl ${bg} border ${border} text-center`}
                >
                  <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${color}`}>{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </FadeInSection>
        </LegalPageLayout>
      </FadeInSection>
    </>
  );
}
