import { Suspense } from "react";
import Link from "next/link";
import { getShows } from "@/lib/supabase";
import { ShowCard } from "@/app/components/ShowCard";

async function ShowsList() {
  const shows = await getShows();

  if (shows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center">
        <div className="mb-4 text-5xl">🃏</div>
        <h3 className="text-lg font-semibold text-gray-700">
          No shows listed yet
        </h3>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Shows will appear here once they&apos;re added. Know of an upcoming
          event? Submit it and help the community.
        </p>
        <Link
          href="#"
          className="mt-6 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
        >
          Submit a Show
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </div>
  );
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
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900"
          >
            DMV TCG Shows
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link
              href="#upcoming"
              className="transition-colors hover:text-gray-900"
            >
              Shows
            </Link>
            <Link href="#" className="transition-colors hover:text-gray-900">
              Submit a Show
            </Link>
            <Link href="#" className="transition-colors hover:text-gray-900">
              About
            </Link>
          </nav>
        </div>
      </header>

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
              <Link
                href="#"
                className="rounded-lg border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Submit a Show
              </Link>
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
