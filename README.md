# 🛒 Untung Utuh

<div align="center">

**Platform toko online ringan untuk UMKM — bebas biaya komisi, order langsung via WhatsApp.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](https://docker.com)

</div>

---

## 📋 Daftar Isi

1. [Tentang Proyek](#-tentang-proyek)
2. [Fitur Utama](#-fitur-utama)
3. [Teknologi](#-teknologi)
4. [Prasyarat](#-prasyarat)
5. [Instalasi](#-instalasi)
6. [Environment](#-environment)
7. [Struktur Folder](#-struktur-folder)
8. [Testing](#-testing)
9. [Deployment](#-deployment)
10. [Kontribusi](#-kontribusi)
11. [Lisensi](#-lisensi)
12. [Kontak](#-kontak)

---

## 📖 Tentang Proyek

### Apa itu Untung Utuh?

**Untung Utuh** adalah platform toko online yang dirancang khusus untuk UMKM Indonesia yang ingin mandiri.

### Masalah yang Diselesaikan

| Masalah | Dampak |
|---|---|
| **Biaya komisi marketplace tinggi** | Memotong margin keuntungan penjual hingga 5–15% per transaksi |
| **Sulit setup toko online sendiri** | Butuh keahlian teknis & biaya developer yang mahal |
| **Terikat ekosistem marketplace** | Tidak punya kendali atas data pelanggan & branding |

### Solusi

- **Zero admin fee** — hanya biaya flat subscription bulanan yang terjangkau, tanpa potongan per transaksi
- **Setup cepat** — antarmuka intuitif, toko online siap dalam hitungan menit
- **Order via WhatsApp** — pembeli tidak perlu registrasi, cukup klik tombol WA untuk memesan
- **Ringan & installable** — performa tinggi di koneksi lambat, dapat dipasang sebagai PWA di smartphone
- **Kendali penuh** — seller memiliki data toko, produk, dan pelanggan mereka sendiri

---

## ✨ Fitur Utama

### 🏪 Untuk Seller

| Fitur | Deskripsi |
|---|---|
| **Adaptive Store Builder** | Template toko otomatis menyesuaikan kategori produk (fashion, kuliner, digital, dll.) |
| **Upload Drag & Drop** | Upload produk secara massal dengan drag & drop, didukung Cloudinary CDN |
| **Katalog Custom Slug** | URL toko yang personal dan mudah diingat |
| **Dashboard Order Pipeline** | Alur pesanan terstruktur: **WA masuk → Konfirmasi → Dikirim → Selesai** |
| **ROI Calculator** | Kalkulator interaktif untuk membandingkan penghematan biaya vs. marketplace |
| **Basic Analytics** | Statistik kunjungan toko, produk terpopuler, dan konversi pesanan |

### 🛍️ Untuk Pembeli

| Fitur | Deskripsi |
|---|---|
| **Katalog Responsif & Cepat** | Halaman produk yang ringan dan tampil mulus di segala perangkat |
| **Order via WhatsApp** | Pesan langsung tanpa registrasi — cukup klik, format pesan otomatis terisi |
| **Halaman Publik SEO-Friendly** | Setiap toko & produk terindeks Google untuk meningkatkan jangkauan organik |

### 🔒 Keamanan

- **JWT Authentication** dengan refresh token rotation
- **Password hashing** menggunakan bcryptjs
- **Input validation & sanitization** — mencegah injeksi NoSQL dan XSS
- **Rate limiting & CORS protection** — membatasi akses berlebihan dari origin tidak sah
- **Helmet security headers** — header HTTP standar keamanan terapan

---

## 🛠 Teknologi

### Stack Utama (MERN)

| Layer | Teknologi | Versi |
|---|---|---|
| **Database** | MongoDB + Mongoose | 8 / 9.x |
| **Backend** | Node.js + Express | 22 / 5.x |
| **Frontend** | React + Vite | 19 / 8.x |
| **Styling** | Tailwind CSS | 4.x |
| **Containerization** | Docker + Docker Compose | latest |

### Backend Dependencies

| Package | Versi | Kegunaan |
|---|---|---|
| `express` | ^5.2.1 | HTTP framework |
| `mongoose` | ^9.6.2 | ODM MongoDB |
| `jsonwebtoken` | ^9.0.3 | JWT auth |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `zod` | ^4.4.3 | Schema validation & sanitization |
| `cloudinary` | ^2.10.0 | CDN upload gambar |
| `multer` | ^2.1.1 | Multipart file upload |
| `helmet` | ^8.1.0 | Security headers |
| `express-rate-limit` | ^8.5.2 | Rate limiting |
| `express-mongo-sanitize` | ^2.2.0 | NoSQL sanitization |
| `winston` | ^3.19.0 | Logging |

### Frontend Dependencies

| Package | Versi | Kegunaan |
|---|---|---|
| `react` | ^19.2.6 | UI library |
| `react-router-dom` | ^7.15.1 | Client-side routing |
| `@tanstack/react-query` | ^5.100.10 | Server state management |
| `axios` | ^1.16.1 | HTTP client |
| `prop-types` | ^15.8.1 | Runtime props validation |
| `tailwindcss` | ^4.3.0 | Utility-first CSS |
| `sonner` | ^2.0.7 | Toast notifications |
| `vitest` | ^4.1.6 | Unit testing |

---

## ✅ Prasyarat

Pastikan semua tools berikut sudah terinstall di mesin Anda:

| Tool | Versi Minimum | Cek Versi |
|---|---|---|
| **Node.js** | >= 20.0.0 | `node -v` |
| **npm** | >= 10.0.0 | `npm -v` |
| **Docker** | latest | `docker -v` |
| **Docker Compose** | V2 | `docker compose version` |
| **Git** | any | `git --version` |

> **Catatan:** Untuk development lokal tanpa Docker, MongoDB juga harus berjalan di localhost.

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/your-username/untung-utuh.git
cd untung-utuh
```

### 2. Setup Environment Files

```bash
make setup
```

Perintah ini akan menyalin semua `.env.example` menjadi `.env` secara otomatis. Kemudian isi nilai yang sebenarnya:

```bash
# Edit environment backend
nano backend/.env

# Edit environment root (untuk Docker)
nano .env
```

> Lihat bagian [Environment](#-environment) untuk detail setiap variabel.

### 3. Jalankan dengan Docker (Direkomendasikan)

```bash
# Development — dengan hot reload
make dev

# atau background
make dev-d
```

Aplikasi akan tersedia di:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5001/api |
| MongoDB | localhost:27017 |

### 4. Jalankan Tanpa Docker (Opsional)

```bash
# Install dependencies backend
cd backend && npm install

# Install dependencies frontend
cd ../frontend && npm install

# Jalankan backend (dari folder backend/)
npm run dev

# Jalankan frontend (dari folder frontend/, terminal baru)
npm run dev
```

---

## ⚙️ Environment

Proyek ini menggunakan beberapa layer environment file:

### Root `.env` — Variabel Docker Compose

```bash
cp .env.example .env
```

| Variabel | Deskripsi |
|---|---|
| `MONGO_ROOT_USER` | Username root MongoDB |
| `MONGO_ROOT_PASSWORD` | Password root MongoDB (gunakan string acak >= 32 karakter) |
| `MONGO_DB` | Nama database |
| `MONGO_APP_USER` | Username aplikasi MongoDB |
| `MONGO_APP_PASSWORD` | Password aplikasi MongoDB |
| `VITE_API_URL` | URL backend API untuk build frontend |
| `VITE_APP_NAME` | Nama aplikasi |
| `VITE_APP_URL` | URL publik aplikasi |

### `backend/.env` — Variabel Backend

```bash
cp backend/.env.example backend/.env
```

| Variabel | Deskripsi |
|---|---|
| `NODE_ENV` | `development` / `staging` / `production` |
| `PORT` | Port backend (default: `5001`) |
| `MONGODB_URI` | Connection string MongoDB |
| `JWT_SECRET` | Secret key JWT — **wajib >= 64 karakter acak** |
| `JWT_EXPIRES_IN` | Masa berlaku token (contoh: `7d`) |
| `CLOUDINARY_CLOUD_NAME` | Nama cloud Cloudinary |
| `CLOUDINARY_API_KEY` | API key Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret Cloudinary |
| `CLOUDINARY_FOLDER` | Folder penyimpanan di Cloudinary |
| `CORS_ORIGIN` | Origins yang diizinkan (pisah koma) |
| `APP_URL` | URL publik backend (untuk sitemap) |
| `LOG_LEVEL` | Level logging Winston (`debug` / `info` / `warn` / `error`) |

> ⚠️ **Penting:** Jangan pernah commit file `.env` yang berisi nilai asli ke version control. Semua file `.env` sudah terdaftar di `.gitignore`.

Generate secret yang aman:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📁 Struktur Folder

```
untung-utuh/
├── 📄 docker-compose.yml           # Docker: environment development
├── 📄 docker-compose.staging.yml   # Docker: environment staging
├── 📄 docker-compose.prod.yml      # Docker: environment production
├── 📄 Makefile                     # Shortcut perintah Docker & testing
├── 📄 .env.example                 # Template variabel Docker Compose
│
├── 📁 backend/                     # Express API Server
│   ├── 📄 server.js                # Entry point
│   ├── 📄 Dockerfile               # Image production
│   ├── 📄 Dockerfile.dev           # Image development (hot reload)
│   ├── 📄 jest.config.js           # Konfigurasi Jest
│   ├── 📄 .env.example             # Template environment backend
│   └── 📁 src/
│       ├── 📄 app.js               # Setup Express app
│       ├── 📁 config/
│       │   ├── cloudinary.js       # Konfigurasi Cloudinary
│       │   ├── database.js         # Koneksi MongoDB
│       │   └── logger.js           # Konfigurasi Winston
│       ├── 📁 controllers/
│       │   ├── authController.js   # Logic autentikasi
│       │   ├── storeController.js  # Logic CRUD toko
│       │   ├── productController.js# Logic CRUD produk + upload gambar
│       │   ├── analyticsController.js # Logic event tracking & summary
│       │   └── uploadController.js # Logic upload file umum
│       ├── 📁 middleware/
│       │   ├── auth.js             # JWT protect middleware
│       │   ├── cors.js             # CORS middleware
│       │   ├── errorHandler.js     # Global error handler
│       │   ├── rateLimiter.js      # Rate limiting (auth & analytics)
│       │   └── validate.js         # Zod validation middleware
│       ├── 📁 models/
│       │   ├── User.js             # Mongoose User schema
│       │   ├── Store.js            # Mongoose Store schema
│       │   ├── Product.js          # Mongoose Product schema
│       │   └── Analytics.js        # Mongoose Analytics schema (TTL 90d)
│       ├── 📁 routes/
│       │   ├── index.js            # Router utama
│       │   ├── auth.js             # Route autentikasi
│       │   ├── store.js            # Route toko
│       │   ├── product.js          # Route produk
│       │   ├── analytics.js        # Route analytics
│       │   ├── upload.js           # Route upload file
│       │   ├── health.js           # Health check endpoint
│       │   └── sitemap.js          # Sitemap XML generator
│       └── 📁 validators/
│           ├── store.js            # Zod schema validasi toko
│           ├── product.js          # Zod schema validasi produk
│           └── analytics.js        # Zod schema validasi analytics
│   └── 📁 tests/
│       ├── setup.js                    # Setup Jest + MongoDB in-memory
│       ├── app.test.js                 # Test Express app & middleware
│       ├── auth.test.js                # Test autentikasi
│       ├── cloudinary.test.js          # Test konfigurasi Cloudinary
│       ├── cors.test.js                # Test CORS middleware
│       ├── database.test.js            # Test koneksi database
│       ├── errorHandler.test.js        # Test global error handler
│       ├── health.test.js              # Test health check endpoint
│       ├── logger.test.js              # Test konfigurasi logger
│       ├── rateLimiter.test.js         # Test rate limiting
│       ├── sitemap.test.js             # Test sitemap generator
│       ├── validate.test.js            # Test Zod validation middleware
│       ├── Store.test.js               # Test Mongoose Store model
│       ├── analyticsController.test.js # Test analytics controller
│       ├── analyticsValidator.test.js  # Test analytics Zod validator
│       ├── productController.test.js   # Test product controller
│       ├── storeController.test.js     # Test store controller
│       ├── uploadController.test.js    # Test upload controller
│       └── uploadStorage.test.js       # Test upload storage
│
├── 📁 frontend/                    # React 19 + Vite App
│   ├── 📄 index.html               # HTML entry point
│   ├── 📄 vite.config.js           # Konfigurasi Vite
│   ├── 📄 eslint.config.js         # Konfigurasi ESLint
│   ├── 📄 Dockerfile               # Image production (Nginx)
│   ├── 📄 Dockerfile.dev           # Image development (hot reload)
│   ├── 📄 nginx.conf               # Konfigurasi Nginx (production)
│   ├── 📄 .env.example             # Template environment frontend
│   ├── 📁 public/
│   │   ├── manifest.webmanifest    # PWA web app manifest
│   │   ├── sw.js                   # Service worker (cache-first strategy)
│   │   ├── offline.html            # Halaman fallback offline
│   │   └── icons/                  # App icons (SVG, maskable)
│   └── 📁 src/
│       ├── 📄 main.jsx             # Entry point React + SW registration
│       ├── 📄 App.jsx              # Root component & routing (lazy)
│       ├── 📁 components/
│       │   ├── Layout/             # Layout wrapper
│       │   ├── SEO/                # SEO metadata (React 19 native)
│       │   ├── products/
│       │   │   ├── ProductCard.jsx # Kartu produk di dashboard
│       │   │   └── ProductForm.jsx # Form buat/edit produk
│       │   ├── store/
│       │   │   ├── StoreHeader.jsx        # Header profil toko publik
│       │   │   ├── StoreProductCard.jsx   # Kartu produk di halaman toko
│       │   │   └── ProductDetailModal.jsx # Modal detail produk + WA order
│       │   └── ui/
│       │       ├── Skeleton.jsx    # Loading skeleton
│       │       ├── LazyImage.jsx   # Gambar lazy-load dengan blur
│       │       ├── Modal.jsx       # Base modal component
│       │       ├── ConfirmDialog.jsx # Dialog konfirmasi hapus
│       │       ├── OfflineBanner.jsx # Banner status offline
│       │       └── InstallPrompt.jsx # Prompt install PWA
│       ├── 📁 hooks/
│       │   ├── useProducts.js      # React Query CRUD + infinite scroll
│       │   ├── useStore.js         # React Query data toko
│       │   ├── useUpload.js        # Upload gambar ke Cloudinary
│       │   ├── useAnalytics.js     # Event tracking hooks
│       │   ├── useDebounce.js      # Debounce input
│       │   ├── useNetworkStatus.js # Online/offline detector
│       │   └── useInstallPrompt.js # PWA install prompt handler
│       ├── 📁 pages/
│       │   ├── Home.jsx            # Halaman beranda
│       │   ├── Dashboard.jsx       # Dashboard seller (CRUD produk)
│       │   ├── StorePage.jsx       # Halaman toko publik
│       │   └── NotFound.jsx        # Halaman 404
│       ├── 📁 services/
│       │   ├── productService.js   # API calls produk
│       │   ├── storeService.js     # API calls toko
│       │   └── analyticsService.js # API calls analytics
│       ├── 📁 styles/
│       │   └── index.css           # Global styles + Tailwind v4
│       └── 📁 utils/
│           └── api.js              # Axios instance & interceptors
│   └── 📁 tests/
│       ├── setup.js                    # Setup Vitest + jsdom
│       ├── api.test.js                 # Test Axios instance & interceptors
│       ├── analyticsService.test.js    # Test analytics service
│       ├── productService.test.js      # Test product service
│       ├── storeService.test.js        # Test store service
│       ├── App.test.jsx                # Test App component & routing
│       ├── App.loading.test.jsx        # Test lazy loading
│       ├── Dashboard.test.jsx          # Test Dashboard page
│       ├── StorePage.test.jsx          # Test halaman toko publik
│       ├── NotFound.test.jsx           # Test halaman 404
│       ├── Layout.test.jsx             # Test Layout component
│       ├── SEO.test.jsx                # Test SEO component
│       ├── ConfirmDialog.test.jsx      # Test dialog konfirmasi
│       ├── InstallPrompt.test.jsx      # Test PWA install prompt
│       ├── LazyImage.test.jsx          # Test lazy-load image
│       ├── Modal.test.jsx              # Test modal component
│       ├── OfflineBanner.test.jsx      # Test banner offline
│       ├── Skeleton.test.jsx           # Test skeleton loading
│       ├── ProductCard.test.jsx        # Test kartu produk dashboard
│       ├── ProductDetailModal.test.jsx # Test modal detail produk
│       ├── ProductForm.test.jsx        # Test form produk
│       ├── StoreHeader.test.jsx        # Test header toko publik
│       ├── StoreProductCard.test.jsx   # Test kartu produk toko
│       ├── useAnalytics.test.jsx       # Test useAnalytics hook
│       ├── useDebounce.test.js         # Test useDebounce hook
│       ├── useInstallPrompt.test.js    # Test useInstallPrompt hook
│       ├── useNetworkStatus.test.js    # Test useNetworkStatus hook
│       ├── useProducts.test.jsx        # Test useProducts hook
│       ├── useStore.test.jsx           # Test useStore hook
│       └── useUpload.test.js           # Test useUpload hook
│
├── 📁 postman/
│   ├── Untung Utuh API.postman_collection.json  # Koleksi 24 request Postman v2.1
│   └── Untung Utuh — Dev.postman_environment.json # Environment variabel dev
│
└── 📁 docker/
    ├── 📁 mongo/
    │   └── mongo-init.js           # Inisialisasi user & database MongoDB
    └── 📁 nginx/
        └── nginx.conf              # Konfigurasi Nginx reverse proxy
```

---

## 🧪 Testing

### Jalankan Semua Tests

```bash
make test-all
```

### Backend Tests (Jest)

```bash
# Semua test
make test-backend

# atau manual
cd backend && npm test

# Watch mode
cd backend && npm run test:watch

# Dengan coverage
cd backend && npm run test:coverage
```

Backend menggunakan **Jest** + **Supertest** + **MongoDB Memory Server** (tidak membutuhkan MongoDB nyata saat testing).

### Frontend Tests (Vitest)

```bash
# Semua test
make test-frontend

# atau manual
cd frontend && npm test

# Watch mode
cd frontend && npm run test:watch

# Dengan coverage
cd frontend && npm run test:coverage
```

Frontend menggunakan **Vitest** + **Testing Library React** + **jsdom**.

### Lint

```bash
cd frontend && npm run lint
```

---

## 🐳 Deployment

Proyek ini mendukung tiga environment deployment via Docker Compose.

### Development

```bash
make dev        # Foreground (dengan log)
make dev-d      # Background (daemon)
make down-dev   # Stop
make logs-dev   # Lihat log
```

| Service | Port |
|---|---|
| Frontend (Vite dev server) | 5173 |
| Backend (nodemon) | 5001 |
| MongoDB | 27017 |

### Staging

```bash
# Setup environment staging
cp .env.example .env.staging
cp backend/.env.example backend/.env.staging
# Isi nilai staging yang sebenarnya

make stag       # Foreground
make stag-d     # Background
make down-stag  # Stop
make logs-stag  # Log
```

### Production

```bash
# Setup environment production
cp .env.example .env.production
cp backend/.env.example backend/.env.production
# Isi nilai production dengan secret yang kuat

make prod       # Build & jalankan (background)
make down-prod  # Stop
make logs-prod  # Log
```

| Service | Port |
|---|---|
| Nginx reverse proxy | 80 |
| Backend | internal |
| MongoDB | internal |

> **Catatan Production:** Pastikan `JWT_SECRET`, `MONGO_ROOT_PASSWORD`, dan `MONGO_APP_PASSWORD` menggunakan nilai acak yang kuat (>= 64 karakter). Jangan gunakan nilai default dari `.env.example`.

### Cleanup Total

```bash
make clean   # Stop semua container + hapus volumes semua environment
```

---

## 🤝 Kontribusi

Kontribusi sangat disambut! Berikut langkah-langkahnya:

1. **Fork** repository ini
2. **Buat branch fitur** baru:
   ```bash
   git checkout -b feat/nama-fitur-anda
   ```
3. **Commit** perubahan dengan pesan yang deskriptif:
   ```bash
   git commit -m "feat: tambah fitur X"
   ```
4. **Push** ke branch Anda:
   ```bash
   git push origin feat/nama-fitur-anda
   ```
5. **Buka Pull Request** ke branch `main`

### Panduan Commit

Ikuti konvensi [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Kegunaan |
|---|---|
| `feat:` | Fitur baru |
| `fix:` | Perbaikan bug |
| `docs:` | Perubahan dokumentasi |
| `chore:` | Pemeliharaan (update deps, config) |
| `test:` | Tambah atau perbaiki test |
| `refactor:` | Refaktor kode tanpa perubahan fitur |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.

```
MIT License

Copyright (c) 2025 kamalfikrikamal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

## 📬 Kontak

Punya pertanyaan, saran, atau ingin berkolaborasi?

| | |
|---|---|
| **Developer** | Muhammad Fikri Kamal |
| **LinkedIn** | [muhammad-fikri-kamal-4b4977260](https://www.linkedin.com/in/muhammad-fikri-kamal-4b4977260) |

---

<div align="center">

**Untung Utuh** — *Jualan Makin Untung, Keuntungan Tetap Utuh.*

Dibuat dengan ❤️ untuk UMKM Indonesia

</div>
