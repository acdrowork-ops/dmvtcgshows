import { Suspense } from "react";
import Link from "next/link";
import { getShows } from "@/lib/supabase";
import { ShowsWithFilters } from "@/app/components/ShowsWithFilters";
import { NavHeader } from "@/app/components/NavHeader";
import { SuggestShowButton } from "@/app/components/SuggestShowButton";

async function ShowsList() {
  const shows = await getShows();
  return <ShowsWithFilters shows={shows} />;
}

function ShowsListSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-56 animate-pulse rounded-2xl border border-gray-200 bg-gray-100"
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <NavHeader />

      <main className="flex flex-col flex-1">
        {/* Hero */}
        <section className="border-b border-gray-100 bg-white px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600 ring-1 ring-blue-100">
              DC · Maryland · Virginia
            </span>
            <h1 className="mt-3 max-w-2xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-6xl">
              Find <span className="text-blue-500">TCG Shows</span> in the DMV
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
              Your go-to directory for Trading Card Game shows, conventions, and
              vendor events across the DMV area. Whether you play Pokémon,
              Magic, One Piece, or Lorcana&mdash;we&apos;ve got you covered.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#upcoming"
                className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-400"
              >
                Browse Upcoming Shows
              </Link>
              <SuggestShowButton className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-600">
                Suggest a Show
              </SuggestShowButton>
            </div>
          </div>
        </section>

        {/* Upcoming Shows */}
        <section id="upcoming" className="flex-1 bg-gray-50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Upcoming Shows
              </h2>
              <p className="mt-2 text-gray-500">
                Shows and events coming up in the DC, Maryland, and Virginia
                region.
              </p>
            </div>

            <Suspense fallback={<ShowsListSkeleton />}>
              <ShowsList />
            </Suspense>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 px-6 py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} DMV TCG Shows &mdash; Built for the
        DMV collecting community.
      </footer>
    </div>
  );
}
