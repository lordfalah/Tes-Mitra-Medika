# Mitra Medika IT Dashboard

Aplikasi internal Rumah Sakit Mitra Medika untuk mempermudah pengelolaan data buku.

Built with: **Next.js 15**, **Prisma**, **React**, **TailwindCSS**, **Zod**, dan **Better-Auth**.

---

## Prerequisites

Pastikan di sistem Anda sudah terinstall:

- Node.js >= 20
- npm atau yarn
- PostgreSQL (atau database yang sesuai dengan `.env` Anda)
- Git (opsional, untuk clone repo)

---

## 1. Clone Repository

```bash
git clone https://github.com/lordfalah/Tes-Mitra-Medika.git
cd Tes-Mitra-Medika
npm install
```

## 2. copy env ini

```bash
DATABASE_URL="postgresql://postgres.tjblfdegrkidzdhlcwoy:L1pql7UoNXAKG5x4@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&connect_timeout=60&pool_timeout=0"

DIRECT_URL="postgresql://postgres.tjblfdegrkidzdhlcwoy:L1pql7UoNXAKG5x4@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

BETTER_AUTH_SECRET=dpzGqZeJM3n4Lp8SZNyuQSUniRKjbGVx
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

GOOGLE_CLIENT_ID=342757183875-5i5nktnhl0oachie05jku61kpegg9509.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

RESEND_API_KEY=re_Ag1uGKqv_Q7ZXrgP988EywU8qgyUp469L
```

## 3. Jalankan

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## 4. Demo Project

- https://tes-mitra-medika.vercel.app/

## 5. API

- POST /api/auth/sign-up/email
- POST /api/auth/sign-out
- POST /api/auth/callback/google
- GET /dashboard

## 6. DEMO

<img width="1849" height="966" alt="Screenshot from 2025-10-21 13-13-30" src="https://github.com/user-attachments/assets/f5fbda7f-eed1-4dfe-82ec-7edd6a528996" />
<img width="1844" height="965" alt="image" src="https://github.com/user-attachments/assets/20798efe-445e-427b-97ac-a03f8111ef5b" />
<img width="1850" height="1145" alt="screencapture-tes-mitra-medika-vercel-app-dashboard-2025-10-21-13_38_15" src="https://github.com/user-attachments/assets/c92f6fd8-00b0-4002-ac79-208463851f4d" />

## 7. API DOCS

### /api/book --- GET

```sh
GET /api/book?page=1&perPage=5&title=javascript&sort=[{"id":"publicationYear","desc":true}] HTTP/1.1
Host: localhost:3000
Cookie: next-auth.session-token=YOUR_TOKEN

Contoh Response (200 - Sukses)
{
  "status": true,
  "message": "Books fetched successfully",
  "data": {
    "data": [
      {
        "id": "b1f2c3d4",
        "title": "Learning JavaScript",
        "author": "John Doe",
        "publicationYear": 2022,
        "description": "A complete guide to JavaScript",
        "createdAt": "2024-10-01T08:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "perPage": 5
  }
}

Contoh Response (401 - Unauthorized)
{
  "status": false,
  "message": "Unauthorized access",
  "errors": null
}
```

### /api/book --- POST

```sh
POST /api/book HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cookie: next-auth.session-token=YOUR_TOKEN

Contoh Request
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "publicationYear": 2008,
  "description": "A Handbook of Agile Software Craftsmanship"
}

Contoh Response (201 - Created)
{
  "status": true,
  "message": "Book berhasil dibuat",
  "data": {
    "id": "12345",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "publicationYear": 2008,
    "description": "A Handbook of Agile Software Craftsmanship",
    "createdAt": "2025-10-21T08:00:00.000Z"
  }
}

Contoh Response (400 - Validasi gagal)
{
  "status": false,
  "message": "Validation error",
  "errors": {
    "title": "Title tidak boleh kosong",
    "author": "Author tidak boleh kosong"
  }
}
```

### /api/book --- DELETE

```sh
POST /api/book HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cookie: next-auth.session-token=YOUR_TOKEN

Contoh Request
DELETE /api/book HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cookie: next-auth.session-token=YOUR_TOKEN

{
  "ids": ["b1f2c3d4", "a9e8f7g6"]
}

Contoh Response (200 - Sukses)
{
  "status": true,
  "message": "Deleted 2 book(s) successfully",
  "data": 2
}

Contoh Response (400 - Tidak ada ID dikirim)
{
  "status": false,
  "message": "No book IDs provided",
  "data": 0
}
```

### /api/book/[id] --- PATCH

```sh
PATCH /api/book/b1f2c3d4 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cookie: next-auth.session-token=YOUR_TOKEN

Contoh Request
{
  "title": "Refactoring",
  "author": "Martin Fowler",
  "publicationYear": 2018,
  "description": "Improving the Design of Existing Code"
}

Contoh Response (200 - Sukses)
{
  "status": true,
  "message": "Book updated successfully",
  "data": {
    "id": "b1f2c3d4",
    "title": "Refactoring",
    "author": "Martin Fowler",
    "publicationYear": 2018,
    "description": "Improving the Design of Existing Code",
    "createdAt": "2025-10-10T08:00:00.000Z",
    "updatedAt": "2025-10-21T09:00:00.000Z"
  }
}

Contoh Response (404 - Tidak ditemukan)
{
  "status": false,
  "message": "Book not found",
  "data": null
}
```
