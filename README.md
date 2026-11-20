# 🎬 Reelio — Personal Cinema & TV Series Watchlist

**Reelio** adalah aplikasi web personal untuk mencatat, mengelola, dan memantau daftar tontonan film serta serial secara mandiri dengan estetika retro-pop indie cinema yang cerah.

---

## 🎨 Desain & Identitas Visual

Reelio mengadopsi identitas retro-pop indie cinema dengan palet warna:
- **Cherry Rose (`#B5185F`)**: Warna brand utama dan aksi penting (tombol utama, brand logo, badge status Selesai).
- **Light Yellow (`#FEFFE0`)**: Latar belakang hangat utama aplikasi.
- **Lime Cream (`#D0E86E`)**: Aksen tontonan aktif (badge status *Sedang Ditonton*).
- **Strong Cyan (`#35C1C2`)**: Aksen antrean (badge status *Ingin Ditonton*).
- **Plum Ink (`#241B21`)**: Teks utama, border tiket kontras, dan bayangan retro pop.
- **Soft Neutral (`#E7DDE2`)**: Border halus, latar sekunder, dan badge *Tidak Dilanjutkan*.

### Status Tontonan & Aturan Kontras
| Status | Label Bahasa Indonesia | Latar Badge | Warna Teks |
| :--- | :--- | :--- | :--- |
| `PLAN_TO_WATCH` | **Ingin Ditonton** | Strong Cyan (`#35C1C2`) | Plum Ink (`#241B21`) |
| `WATCHING` | **Sedang Ditonton** | Lime Cream (`#D0E86E`) | Plum Ink (`#241B21`) |
| `COMPLETED` | **Selesai** | Cherry Rose (`#B5185F`) | Light Yellow (`#FEFFE0`) |
| `DROPPED` | **Tidak Dilanjutkan** | Soft Neutral (`#E7DDE2`) | Plum Ink (`#241B21`) |

---

## 🏗 Arsitektur Monorepo

```
reelio/
├── apps/
│   ├── api/                      # Backend: NestJS REST API
│   │   ├── prisma/
│   │   │   ├── migrations/       # SQL Migrations PostgreSQL
│   │   │   ├── schema.prisma     # Definisi Data Model Prisma
│   │   │   └── seed.ts           # Script Seed Demo Lokal
│   │   ├── src/
│   │   │   ├── auth/             # Modul Autentikasi JWT & Guard
│   │   │   │   ├── dto/          # RegisterDto, LoginDto
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── watchlist/        # Modul Watchlist & Statistik
│   │   │   │   ├── dto/          # Create, Update, Query DTOs
│   │   │   │   ├── watchlist.service.ts
│   │   │   │   └── watchlist.controller.ts
│   │   │   ├── prisma/           # Prisma Client Service & Module
│   │   │   ├── common/           # Filter HTTP Exception & Interceptors
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── package.json
│   │
│   └── web/                      # Frontend: Next.js (App Router)
│       ├── src/
│       │   ├── app/              # Next.js Pages & Layouts
│       │   │   ├── layout.tsx    # Root Layout & Auth Provider
│       │   │   ├── page.tsx      # Entry Redirect
│       │   │   ├── login/        # Halaman Masuk
│       │   │   ├── register/     # Halaman Registrasi
│       │   │   ├── dashboard/    # Ringkasan Statistik & Tontonan Terbaru
│       │   │   └── watchlist/    # Daftar Tontonan, Detail, Tambah, Edit
│       │   ├── components/       # Komponen UI Reusable
│       │   │   ├── Navbar.tsx
│       │   │   ├── StatusBadge.tsx
│       │   │   ├── TypeBadge.tsx
│       │   │   ├── StarRating.tsx
│       │   │   ├── StatsCards.tsx
│       │   │   ├── WatchlistCard.tsx
│       │   │   ├── WatchlistForm.tsx
│       │   │   └── DeleteConfirmModal.tsx
│       │   └── lib/              # Client API & Auth Context
│       │       ├── api.ts
│       │       ├── types.ts
│       │       └── auth-context.tsx
│       ├── tailwind.config.ts
│       └── package.json
│
├── .env.example                  # Template Environment Global
├── package.json                  # Root npm Workspaces
└── README.md                     # Dokumentasi Proyek
```

---

## 🛠 Stack Teknologi

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React Icons.
- **Backend**: NestJS, TypeScript, Passport.js, JWT, `bcryptjs`, `class-validator`, `class-transformer`.
- **Database & ORM**: PostgreSQL, Prisma ORM dengan migrasi terstruktur.
- **Testing**: Jest, Supertest, Unit & Integration Tests.

---

## ⚙️ Variabel Environment

Salin `.env.example` ke file `.env` di root atau masing-masing sub-aplikasi:

```bash
cp .env.example .env
```

### Variabel Backend (`apps/api/.env`)
| Variabel | Keterangan | Contoh Nilai |
| :--- | :--- | :--- |
| `DATABASE_URL` | Koneksi PostgreSQL | `postgresql://postgres:postgres@localhost:5432/reelio?schema=public` |
| `JWT_SECRET` | Kunci rahasia signing JWT (Hanya di server) | `reelio-super-secret-jwt-key` |
| `PORT` | Port server NestJS API | `4000` |
| `FRONTEND_URL` | Origin Frontend untuk konfigurasi CORS | `http://localhost:3000` |

### Variabel Frontend (`apps/web/.env.local`)
| Variabel | Keterangan | Contoh Nilai |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Alamat publik API NestJS | `http://localhost:4000` |

*Catatan Keamanan: `JWT_SECRET` dan `DATABASE_URL` tidak pernah diekspos ke frontend atau diberi prefiks `NEXT_PUBLIC_`.*

---

## 🚀 Panduan Menjalankan Secara Lokal

### 1. Prasyarat
- **Node.js**: v18+ atau v20+ / v22+ / v24+
- **PostgreSQL**: instance PostgreSQL lokal (port 5432) atau database cloud (Supabase/Neon/Railway).

### 2. Instalasi Dependensi
Jalankan perintah berikut di root repository:
```bash
npm install
```

### 3. Generate Prisma Client & Database Migration
Pastikan variabel `DATABASE_URL` telah terarah ke database PostgreSQL Anda, lalu jalankan:
```bash
npm run prisma:generate --workspace=apps/api
npm run prisma:deploy --workspace=apps/api
```
*(Opsional) Isi database dengan data demo lokal:*
```bash
npm run prisma:seed --workspace=apps/api
```
Data demo lokal:
- Email: `demo@reelio.com`
- Password: `password123`

### 4. Menjalankan Server Development

- **Jalankan Backend API (Port 4000):**
  ```bash
  npm run dev:api
  ```
- **Jalankan Frontend Web (Port 3000):**
  ```bash
  npm run dev:web
  ```

Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 🔒 Autentikasi & Isolasi Data (Ownership)

1. **Strategi JWT & Guard**:
   - Frontend menyimpan token pada `localStorage` (`reelio_token`).
   - Setiap permintaan ke endpoint yang dilindungi menyertakan header `Authorization: Bearer <token>`.
2. **Isolasi Pengguna Total**:
   - Backend tidak pernah mempercayai `userId` yang dikirimkan via query atau body.
   - `userId` selalu diekstrak secara aman dari payload token JWT terverifikasi melalui decorator `@CurrentUser()`.
   - Pengguna A tidak dapat melihat, mengubah, maupun menghapus data milik Pengguna B. Jika Pengguna A meminta ID milik Pengguna B, backend mengembalikan status **404 Not Found** tanpa membocorkan eksistensi data milik orang lain.
   - Perhitungan statistik (`/watchlist/stats`) hanya menjumlahkan item milik pengguna aktif.

---

## 📡 Daftar Endpoint REST API

### Autentikasi (Publik)
| Method | Endpoint | Deskripsi | Status Sukses |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Mendaftarkan akun baru | `201 Created` |
| `POST` | `/auth/login` | Masuk dan memperoleh JWT | `200 OK` |
| `GET` | `/auth/me` | Memeriksa data profil user aktif (Bearer token) | `200 OK` |

### Watchlist (Wajib Bearer Token)
| Method | Endpoint | Deskripsi | Status Sukses |
| :--- | :--- | :--- | :--- |
| `GET` | `/watchlist` | Mengambil seluruh tontonan user dengan filter & sort | `200 OK` |
| `GET` | `/watchlist/stats` | Statistik tontonan (total, status, tipe, avg rating) | `200 OK` |
| `GET` | `/watchlist/:id` | Detail tontonan spesifik milik user | `200 OK` |
| `POST` | `/watchlist` | Menambahkan item tontonan baru | `201 Created` |
| `PATCH` | `/watchlist/:id` | Memperbarui item tontonan milik user | `200 OK` |
| `DELETE` | `/watchlist/:id` | Menghapus item tontonan milik user | `200 OK` |

### Health Check (Publik)
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/health` | Pemeriksaan kesehatan layanan API |

---

## 🧪 Pengujian & Build

- **Menjalankan Unit Test Backend:**
  ```bash
  npm run test:api
  ```
- **Menjalankan Typecheck & Build Monorepo:**
  ```bash
  npm run build
  ```

---

## 🌐 Panduan Deployment Produksi

### Backend (Render / Railway / Fly.io / VPS)
1. Sambungkan repository ke provider hosting backend.
2. Atur Root Directory ke `apps/api`.
3. Masukkan Environment Variables:
   - `DATABASE_URL`: URL PostgreSQL hosted (misal Neon / Supabase).
   - `JWT_SECRET`: Token rahasia acak yang panjang dan aman.
   - `PORT`: Ditentukan oleh provider (misal `4000` atau default `PORT`).
   - `FRONTEND_URL`: URL produksi frontend (misal `https://reelio.vercel.app`).
4. Build Command: `npm install && npx prisma generate && npm run build`
5. Start Command: `node dist/main`
6. Migrasi Database: Jalankan `npx prisma migrate deploy` sebelum server mulai.

### Frontend (Vercel / Netlify)
1. Import repository ke Vercel/Netlify.
2. Atur Root Directory ke `apps/web`.
3. Masukkan Environment Variable:
   - `NEXT_PUBLIC_API_URL`: URL publik backend NestJS yang telah dideploy (misal `https://api.reelio.domain.com`).
4. Build Command: `npm run build`
5. Output Directory: `.next`

---
*Dibuat dengan dedikasi untuk para pecinta film & serial sinema independen.*
