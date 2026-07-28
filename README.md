# MesinBagus

MesinBagus adalah marketplace mesin industri berbasis **Next.js 16 App Router**, **React 19**, **TypeScript**, **Prisma 7**, dan **MySQL/MariaDB**. Aplikasi ini menyediakan katalog produk, detail mesin, saved products, pembuatan draft Purchase Order (PO), pengiriman permintaan melalui WhatsApp, akun pembeli, Google Login, dan panel admin.

## Teknologi

- Next.js 16.2 (App Router)
- React 19 dan TypeScript
- Tailwind CSS 4
- Prisma ORM 7
- MySQL atau MariaDB
- NextAuth.js 4
- Google OAuth
- PWA (Progressive Web App)
- React Hook Form, Zod, dan TanStack Query

## Persyaratan Sistem

Pastikan perangkat sudah memiliki:

- Node.js **20.19.0 atau lebih baru**
- npm
- MySQL 5.7+ atau MariaDB 10.2+
- Git

Untuk pengguna Laragon, aktifkan Apache/Nginx dan MySQL/MariaDB dari Laragon. Web development Next.js tetap dijalankan melalui `npm run dev`.

## Instalasi dari GitHub

### 1. Clone repository

```bash
git clone https://github.com/USERNAME/NAMA-REPOSITORY.git
cd NAMA-REPOSITORY
```

Ganti URL repository dengan URL GitHub project ini.

### 2. Install dependency

```bash
npm install
```

### 3. Buat database

Contoh menggunakan MySQL/MariaDB:

```sql
CREATE DATABASE indah_mesin
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 4. Buat file environment

Buat file `.env` pada root project:

```env
DATABASE_URL="mysql://root:PASSWORD_DATABASE@127.0.0.1:3306/indah_mesin"

AUTH_SECRET="GANTI_DENGAN_SECRET_ACAK_YANG_PANJANG"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

Contoh Laragon apabila user `root` tidak memiliki password:

```env
DATABASE_URL="mysql://root:@127.0.0.1:3306/indah_mesin"
```

Jangan commit `.env` ke GitHub. File environment sudah dikecualikan melalui `.gitignore`.

Untuk membuat `AUTH_SECRET`, salah satu caranya:

```bash
openssl rand -base64 32
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Jalankan migration

Untuk development:

```bash
npm run db:migrate
```

Untuk server production yang hanya perlu menerapkan migration yang sudah ada:

```bash
npx prisma migrate deploy
```

### 7. Jalankan seeder

```bash
npm run db:seed
```

Seeder mengisi akun demo, perusahaan, alamat, kategori, produk, media, fitur,
spesifikasi, dokumen produk, artikel, filter, contact settings, FAQ, saved
products, review, RFQ, order, dan archive document.

| Peran | Email | Password |
|---|---|---|
| Buyer/Purchasing | `user@indahmesin.com` | `Indah@2026` |
| Admin | `admin@indahmesin.com` | `Indah@2026` |
| Super Admin | `superadmin@indahmesin.com` | `Indah@2026` |

> Akun di atas hanya untuk development/demo. Ubah atau nonaktifkan kredensial tersebut sebelum deployment production.

### 8. Jalankan development server

```bash
npm run dev
```

Buka:

- Storefront: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Konfigurasi Google Login

1. Buka Google Cloud Console.
2. Buat atau pilih project.
3. Konfigurasi **OAuth consent screen**.
4. Buat **OAuth Client ID** dengan tipe **Web application**.
5. Tambahkan Authorized JavaScript Origin:

```text
http://localhost:3000
```

6. Tambahkan Authorized Redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

7. Salin credential ke `.env`:

```env
GOOGLE_CLIENT_ID="client-id-dari-google"
GOOGLE_CLIENT_SECRET="client-secret-dari-google"
AUTH_SECRET="secret-aplikasi"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

8. Matikan dan jalankan ulang development server setelah mengubah `.env`.

Untuk production, ganti origin dan callback dengan domain HTTPS production:

```text
https://domain-anda.com
https://domain-anda.com/api/auth/callback/google
```

Nama variable harus sama persis dan menggunakan huruf kapital. Project ini membaca `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET`, bukan nama variable lain.

## Perintah yang Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Membuat production build |
| `npm run start` | Menjalankan hasil production build |
| `npm run lint` | Menjalankan ESLint |
| `npm run db:migrate` | Membuat/menerapkan migration development |
| `npm run db:seed` | Mengisi data awal |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma studio` | Membuka GUI database Prisma |

## Struktur Project

```text
indah_mesin/
├── app/                    # Route, halaman, layout, dan API Next.js
│   ├── (storefront)/       # Route group tampilan pengguna
│   ├── (document)/         # Halaman dokumen tanpa shell storefront
│   ├── admin/
│   │   └── (dashboard)/    # Halaman dashboard admin
│   └── api/
│       ├── (auth)/         # Endpoint autentikasi
│       ├── (storefront)/   # Endpoint untuk pengguna/storefront
│       └── admin/          # Endpoint admin
├── components/             # Komponen React reusable
│   ├── admin/              # Komponen panel admin
│   ├── storefront/         # Komponen dan layout tampilan pengguna
│   ├── providers/          # Context/provider global
│   ├── pwa/                # Registrasi service worker
│   └── ui/                 # Komponen UI dasar
├── lib/
│   ├── admin/              # Data access/helper admin
│   └── storefront/         # Katalog, PO, contact, profile, dan WhatsApp
├── services/               # Service/use-case aplikasi
├── prisma/
│   ├── schema.prisma       # Model dan relasi database
│   ├── migrations/         # Riwayat perubahan schema database
│   └── seed.ts             # Seeder
├── public/                 # Asset statis dan upload publik
├── scripts/
│   └── generate-icons.mjs  # Regenerasi icon PNG untuk PWA
├── types/                  # TypeScript type declarations
├── proxy.ts                # Proteksi dan redirect route
├── prisma.config.ts        # Konfigurasi Prisma 7
├── next.config.ts          # Konfigurasi Next.js
└── package.json            # Dependency dan npm scripts
```

Folder dengan tanda kurung seperti `(storefront)` dan `(document)` adalah **route group**. Namanya tidak masuk ke URL. Contohnya, `app/(storefront)/contact/page.tsx` tetap menghasilkan URL `/contact`.

Route group yang aktif:

- `(storefront)`: seluruh halaman yang dilihat pengguna dan memakai navbar toko.
- `(document)`: preview dokumen/PDF tanpa navbar toko.
- `admin/(dashboard)`: halaman yang dibungkus layout dashboard admin.
- `api/(auth)`: endpoint autentikasi; `(auth)` tidak masuk ke URL.
- `api/(storefront)`: endpoint pengguna; `(storefront)` tidak masuk ke URL.

Folder lama `app/(app)` sudah dihapus karena hanya sisa prototype SCADA dan tidak
berisi route aktif.

Folder dengan kurung siku adalah route dinamis. Contohnya:

```text
app/(storefront)/products/[id]/page.tsx
```

menghasilkan URL seperti:

```text
/products/lini-penutup-kaleng-rotary
```

## Padanan Struktur Laravel

Project ini tidak menggunakan pola MVC Laravel secara persis, tetapi tanggung jawabnya dapat dipetakan sebagai berikut:

| Konsep Laravel | Lokasi di project ini | Keterangan |
|---|---|---|
| `routes/web.php` | `app/**/page.tsx` | Folder dan `page.tsx` otomatis membentuk URL halaman |
| `routes/api.php` | `app/api/**/route.ts` | Endpoint API dengan fungsi `GET`, `POST`, `PATCH`, atau `DELETE` |
| Blade Views | `app/**/page.tsx` dan `components/**/*.tsx` | Tampilan dibuat dengan React/TSX |
| Layout Blade | `app/layout.tsx` dan nested `layout.tsx` | UI bersama yang membungkus halaman |
| Controller | `app/api/**/route.ts`, Server Components, dan `services/` | Request handler dan use-case; tidak ada folder controller wajib |
| Eloquent Model | Model dalam `prisma/schema.prisma` | Mendefinisikan tabel, field, enum, dan relasi |
| Query/Eloquent | `lib/prisma.ts`, `lib/*.ts`, `services/*.ts` | Query database menggunakan Prisma Client |
| Migration | `prisma/migrations/**/migration.sql` | Riwayat perubahan struktur database |
| Seeder | `prisma/seed.ts` | Mengisi data awal dan akun demo |
| Middleware | `proxy.ts` | Proteksi admin/profile berdasarkan session dan role |
| Form Request/Validation | Schema Zod dan handler terkait | Validasi payload sebelum diproses |
| Service class | `services/` dan beberapa modul `lib/` | Logika bisnis yang dipisahkan dari tampilan |
| `config/*.php` | `next.config.ts`, `prisma.config.ts`, `.env` | Konfigurasi aplikasi, Prisma, dan environment |
| `public/` | `public/` | Asset yang dapat diakses langsung dari browser |

### Model dan database

Model utama berada di `prisma/schema.prisma`, antara lain:

- `User`, `Company`, dan `CompanyAddress`
- `Category`, `Brand`, dan `Product`
- `ProductMedia`, `ProductFeature`, `ProductDocument`, dan `ProductSpecification`
- `SavedItem` dan `CartItem`
- `RfqRequest` dan `RfqItem`
- `Order`, `OrderItem`, dan `ArchiveDocument`
- `Article`, `Faq`, `ProductReview`, dan `SiteSetting`

Koneksi database dibuat sekali melalui `lib/prisma.ts` menggunakan `@prisma/adapter-mariadb`.

### Routes dan views

Contoh halaman:

| URL | File |
|---|---|
| `/` | `app/page.tsx` |
| `/categories` | `app/(storefront)/categories/page.tsx` |
| `/products/[id]` | `app/(storefront)/products/[id]/page.tsx` |
| `/contact` | `app/(storefront)/contact/page.tsx` |
| `/po-preview` | `app/(storefront)/po-preview/page.tsx` |
| `/profile` | `app/(storefront)/profile/page.tsx` |
| `/admin/dashboard` | `app/admin/(dashboard)/dashboard/page.tsx` |

`page.tsx` biasanya berfungsi sebagai halaman/server component. UI yang interaktif dipisahkan ke komponen dengan directive `"use client"`.

### API atau controller

Contoh endpoint:

| Endpoint | File | Fungsi |
|---|---|---|
| `/api/auth/[...nextauth]` | `app/api/(auth)/auth/[...nextauth]/route.ts` | Login/session NextAuth |
| `/api/auth/register` | `app/api/(auth)/auth/register/route.ts` | Registrasi akun |
| `/api/products` | `app/api/(storefront)/products/route.ts` | Data katalog produk |
| `/api/profile` | `app/api/(storefront)/profile/route.ts` | Membaca/memperbarui profil |
| `/api/profile/orders` | `app/api/(storefront)/profile/orders/route.ts` | Data order pengguna |
| `/api/profile/documents` | `app/api/(storefront)/profile/documents/route.ts` | Dokumen pengguna |
| `/api/shop/saved` | `app/api/(storefront)/shop/saved/route.ts` | Saved products |
| `/api/admin/upload` | `app/api/admin/upload/route.ts` | Upload file admin |

Dalam Next.js, file `route.ts` adalah padanan terdekat sebuah controller API sekaligus definisi route.

### Middleware dan authorization

`proxy.ts` memeriksa token NextAuth sebelum request masuk ke halaman:

- `/admin/*` hanya untuk `ADMIN` atau `SUPERADMIN`
- `/admin/users` hanya untuk `SUPERADMIN`
- `/profile/*` membutuhkan session pengguna

Project sudah menggunakan konvensi `proxy.ts` yang berlaku pada Next.js 16.

### Components

- `components/ui/`: tombol, notifikasi, dan wrapper Material Symbols yang digunakan aplikasi.
- `components/storefront/`: katalog, detail produk, pencarian, contact, profile, PO, dan navigasi toko.
- `components/admin/`: CRUD dan tampilan panel admin.
- `components/storefront/layout/`: shell storefront, fixed CTA, dan bottom navigation pengguna.

### Library dan services

- `lib/auth.ts`: konfigurasi credentials login, Google OAuth, JWT, dan session.
- `lib/prisma.ts`: singleton Prisma Client.
- `lib/storefront/catalog-data.ts`: data fallback dan definisi katalog.
- `lib/storefront/product-detail-enrichment.ts`: detail tambahan semua produk.
- `lib/storefront/po-draft.ts`: state dan data draft PO.
- `lib/storefront/whatsapp.ts`: nomor serta template WhatsApp.
- `services/admin/`: query/use-case khusus dashboard dan modul admin.

## Alur Perubahan Database

Setelah mengubah `prisma/schema.prisma`, jalankan:

```bash
npm run db:migrate -- --name nama_perubahan
npx prisma generate
```

Jangan mengedit migration lama yang sudah pernah diterapkan di production. Buat migration baru.

Untuk melihat isi database:

```bash
npx prisma studio
```

## Production

Periksa aplikasi:

```bash
npm run lint
npm run build
```

Jalankan hasil build:

```bash
npm run start
```

Environment production minimal:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
AUTH_SECRET="SECRET_PRODUCTION"
NEXT_PUBLIC_APP_URL="https://domain-anda.com"
GOOGLE_CLIENT_ID="GOOGLE_PRODUCTION_CLIENT_ID"
GOOGLE_CLIENT_SECRET="GOOGLE_PRODUCTION_CLIENT_SECRET"
```

Pastikan:

- database production sudah dibuat;
- `npx prisma migrate deploy` sudah dijalankan;
- Google OAuth callback menggunakan domain production;
- aplikasi dijalankan di belakang HTTPS;
- direktori upload memiliki penyimpanan persisten jika deployment tidak menggunakan filesystem permanen;
- akun demo dan password bawaan sudah diubah.

## Troubleshooting

### `DATABASE_URL is not set`

Pastikan `.env` berada di root project dan berisi `DATABASE_URL`, lalu restart server.

### Prisma tidak mengenali model terbaru

```bash
npx prisma generate
```

Setelah itu restart development server.

### Database tidak dapat terhubung

- Pastikan MySQL/MariaDB aktif.
- Pastikan database sudah dibuat.
- Periksa user, password, host, port, dan nama database pada `DATABASE_URL`.
- Karakter khusus pada password harus di-URL-encode.

### Google Login tidak muncul atau credential tidak terbaca

- Pastikan nama variable adalah `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET`.
- Pastikan keduanya berada di `.env`, bukan hanya salah satunya.
- Restart `npm run dev` setelah mengubah `.env`.
- Periksa Authorized Redirect URI di Google Cloud.
- Pastikan `AUTH_SECRET` tersedia.

### Google menampilkan `redirect_uri_mismatch`

Redirect URI Google Cloud harus sama persis:

```text
http://localhost:3000/api/auth/callback/google
```

Port, protokol, domain, dan path harus identik.

### Port 3000 sudah digunakan

```bash
npm run dev -- --port 3001
```

Jika port berubah, sesuaikan `NEXT_PUBLIC_APP_URL` dan Google OAuth redirect URI.

## Keamanan

- Jangan commit `.env`, secret OAuth, password database, atau `AUTH_SECRET`.
- Validasi upload dan batasi tipe/ukuran file sebelum production.
- Ganti seluruh akun demo setelah seeding production.
- Gunakan HTTPS.
- Gunakan user database khusus aplikasi dengan permission minimum.

## Lisensi

Tambahkan informasi lisensi project di bagian ini sebelum repository dipublikasikan.
