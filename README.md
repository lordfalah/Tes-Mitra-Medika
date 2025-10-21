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
git clone <[URL_REPO_ANDA](https://github.com/lordfalah/Tes-Mitra-Medika.git)>
cd Tes-Mitra-Medika

# Salin file contoh .env ke env.local
cp .env .env.local


npm install

npx prisma migrate dev --name init
npx prisma db seed 
npm run dev
```


