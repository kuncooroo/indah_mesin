# ERD — Indah Mesin Marketplace

Struktur database selaras dengan layar Stitch / shop: beranda & artikel, kategori & filter, detail produk, favorit, PO preview, profil, kontak, dan admin.

## Diagram (Mermaid)

```mermaid
erDiagram
  User ||--o{ Favorite : saves
  User ||--o{ PurchaseOrder : creates
  Category ||--o{ Product : contains
  Product ||--o{ ProductDocument : has
  Product ||--o{ Favorite : bookmarked
  Product ||--o{ PurchaseOrderItem : quoted
  PurchaseOrder ||--|{ PurchaseOrderItem : includes

  User {
    string id PK
    string username UK
    string email UK
    string password
    enum role
    string name
    string avatarUrl
    string phone
    string companyName
    string buyerCode UK
    boolean verifiedBuyer
    string language
    string companyAddress
  }

  Category {
    string id PK
    string slug UK
    string name
    string icon
    enum group
    int sortOrder
  }

  Product {
    string id PK
    string sku UK
    string categoryId FK
    string categorySlug
    string categoryLabel
    string name
    enum status
    boolean published
  }

  ProductDocument {
    string id PK
    string productId FK
    string title
    string fileUrl
  }

  Article {
    string id PK
    string slug UK
    string title
    datetime publishedAt
    boolean published
  }

  Favorite {
    string id PK
    string userId FK
    string productId FK
  }

  PurchaseOrder {
    string id PK
    string userId FK
    enum status
    string picName
    string companyName
  }

  PurchaseOrderItem {
    string id PK
    string purchaseOrderId FK
    string productId FK
    string sku
  }

  SiteSetting {
    string id PK
    string brandName
    string phoneDisplay
    json headOfficeLines
  }

  QuickFilter {
    string id PK
    string label UK
    int sortOrder
  }
```

## Pemetaan layar → tabel

| Layar / fitur | Tabel utama |
|---------------|-------------|
| Login / Admin | `User` |
| Beranda artikel | `Article`, `Category` (group BERANDA), `QuickFilter`, `Product` |
| Categories & filter | `Category` (MARKETPLACE, FILTER), `Product` |
| Detail produk | `Product`, `ProductDocument` |
| Favorites | `Favorite`, `User`, `Product` |
| PO Preview | `PurchaseOrder`, `PurchaseOrderItem`, `User` |
| Profile | `User` (profil perusahaan & buyer) |
| Contact | `SiteSetting` |
| Admin dashboard | Semua tabel (statistik & CRUD) |

## Enum

- **Role:** `USER`, `ADMIN`, `SUPERADMIN`
- **ProductStockStatus:** `READY`, `INDENT`, `CONTACT`
- **CategoryGroup:** `MARKETPLACE`, `FILTER`, `BERANDA`
- **PurchaseOrderStatus:** `DRAFT`, `SUBMITTED`, `WHATSAPP_SENT`

## Akses admin

- URL: **`http://localhost:3000/admin/login`** → setelah login: **`/admin/dashboard`**
- Langsung (setelah login): **`http://localhost:3000/admin/dashboard`**

| Username | Password | Role | Akses admin |
|----------|----------|------|-------------|
| `user` | `Indah@2026` | USER | Tidak (redirect ke beranda) |
| `admin` | `Indah@2026` | ADMIN | Dashboard + produk |
| `superadmin` | `Indah@2026` | SUPERADMIN | Dashboard + produk + kelola user |

## Perintah database

```bash
npx prisma migrate dev
npx prisma db seed
```
