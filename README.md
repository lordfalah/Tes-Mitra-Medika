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
