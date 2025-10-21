import mitramedika from "@/assets/mitra_medika.jpg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-8 flex items-center justify-center gap-4">
          <Image
            src={mitramedika}
            alt="mitra medika logo"
            width={80}
            height={80}
            className="border-muted rounded-full border"
            priority
          />
        </div>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Mitra Medika Tes Staff IT
        </h1>
        <p className="text-muted-foreground mt-3 text-base text-balance sm:text-lg">
          Aplikasi internal Rumah Sakit Mitra Medika untuk mempermudah
          pengelolaan data buku.{" "}
          <Link
            href="https://mitramedikahealthcare.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Mitra Medika
          </Link>
        </p>
        <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
