import { getServerSession } from "@/lib/get-session";
import type { Metadata } from "next";

import { unauthorized } from "next/navigation";
import {
  EmailVerificationAlert,
  ProfileInformation,
} from "./_components/profile-information";
import { SearchParams } from "nuqs";
import { searchParamsCacheBook } from "@/lib/search-params/search-book";
import DataTableBook from "./_components/table/data-table-book";
import CreateBookSheet from "./_components/create-book-sheet";
import { fetchBooks } from "@/lib/data/book";

export const metadata: Metadata = {
  title: "Dashboard",
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const search = searchParamsCacheBook.parse(await searchParams);
  const [session, { data }] = await Promise.all([
    getServerSession(),
    await fetchBooks(search),
  ]);
  const user = session?.user;
  if (!user) unauthorized();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your account overview.
          </p>
        </div>
        {!user.emailVerified && <EmailVerificationAlert />}
        <ProfileInformation user={user} />

        <div className="space-y-2.5">
          <CreateBookSheet />
          {data.data && <DataTableBook data={data.data} total={data.total} />}
        </div>
      </div>
    </main>
  );
}
