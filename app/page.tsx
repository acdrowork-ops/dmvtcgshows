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
        <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-28 text-center text-white">
          <div className="mx-auto max-w-3xl">
            <span className="mb-4 inline-block rounded-full bg-indigo-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-300 ring-1 ring-indigo-500/30">
              DC · Maryland · Virginia
            </span>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Find TCG Shows Near You
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Your go-to directory for Trading Card Game shows, conventions, and
              vendor events across the DMV area. Whether you play Pokémon,
              Magic, One Piece, or Lorcana&mdash;we&apos;ve got you covered.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="#upcoming"
                className="rounded-lg bg-indigo-500 px-7 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-400"
              >
                Browse Upcoming Shows
              </Link>
              <SuggestShowButton className="rounded-lg border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
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
      <footer className="border-t border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} DMV TCG Shows &mdash; Built for the
        DMV collecting community.
      </footer>
    </div>
  );
}
