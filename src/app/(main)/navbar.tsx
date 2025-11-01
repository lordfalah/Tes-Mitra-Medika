import mitramedikalogo from "@/assets/mitra_medika.jpg";
import { ModeToggle } from "@/components/mode-toggle";
import { UserDropdown } from "@/components/user-dropdown";
import { getServerSession } from "@/lib/get-session";
import type { Session } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export async function Navbar() {
  const session = getServerSession();

  return (
    <header className="bg-background border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Image
            src={mitramedikalogo}
            alt="Mitra Medika"
            width={32}
            height={32}
            className="border-muted rounded-full border"
          />
          Mitra Medika Tes
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />

          <Suspense fallback={<Skeleton className="h-9 w-28" />}>
            <AvatarUser auth={session} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export async function AvatarUser({ auth }: { auth: Promise<Session | null> }) {
  const session = await auth;

  return session ? (
    <UserDropdown user={session.user} />
  ) : (
    <Skeleton className="h-9 w-28" />
  );
}
