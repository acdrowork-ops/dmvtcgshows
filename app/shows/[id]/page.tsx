import { notFound } from "next/navigation";
import Link from "next/link";
import { getShowById } from "@/lib/supabase";

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default async function ShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const show = await getShowById(id);
  if (!show) notFound();

  const timeRange = show.start_time
    ? show.end_time
      ? `${formatTime(show.start_time)} – ${formatTime(show.end_time)}`
      : formatTime(show.start_time)
    : "";

  const hasLinks =
    show.website_url ||
    show.instagram_url ||
    show.facebook_url ||
    show.social_url;

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
              href="/#upcoming"
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

      <main className="flex flex-col flex-1 bg-gray-50">
        <div className="mx-auto w-full max-w-3xl px-6 py-12">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
          >
            ← Back to all shows
          </Link>

          {/* Flyer */}
          {show.flyer_image_url && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={show.flyer_image_url}
                alt={`Flyer for ${show.name}`}
                className="max-h-[480px] w-full object-contain"
              />
            </div>
          )}

          {/* Detail card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            {/* Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                {show.show_type}
              </span>
              {show.is_first_event && (
                <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700">
                  First Event
                </span>
              )}
              {show.is_recurring && (
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                  Recurring
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {show.name}
            </h1>

            <dl className="mt-6 flex flex-col gap-5 text-sm">
              <div className="flex items-start gap-3">
                <dt className="shrink-0 text-xl leading-6">📅</dt>
                <dd>
                  <span className="font-semibold text-gray-900">
                    {formatDate(show.date)}
                  </span>
                  <span className="mt-0.5 block text-gray-500">{timeRange}</span>
                </dd>
              </div>

              <div className="flex items-start gap-3">
                <dt className="shrink-0 text-xl leading-6">📍</dt>
                <dd>
                  <span className="font-semibold text-gray-900">
                    {show.venue}
                  </span>
                  <span className="mt-0.5 block text-gray-500">
                    {show.city}, {show.state}
                  </span>
                </dd>
              </div>

              {show.entry_fee && (
                <div className="flex items-start gap-3">
                  <dt className="shrink-0 text-xl leading-6">🎟</dt>
                  <dd>
                    <span className="font-semibold text-gray-900">
                      Entry: {show.entry_fee}
                    </span>
                  </dd>
                </div>
              )}

              {show.table_count && (
                <div className="flex items-start gap-3">
                  <dt className="shrink-0 text-xl leading-6">🪑</dt>
                  <dd>
                    <span className="font-semibold text-gray-900">
                      {show.table_count} tables
                    </span>
                  </dd>
                </div>
              )}

              {show.organizer && (
                <div className="flex items-start gap-3">
                  <dt className="shrink-0 text-xl leading-6">🧑‍💼</dt>
                  <dd>
                    <span className="font-semibold text-gray-900">
                      {show.organizer}
                    </span>
                  </dd>
                </div>
              )}
            </dl>

            {/* Links */}
            {hasLinks && (
              <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-100 pt-6">
                {show.website_url && (
                  <Link
                    href={show.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                  >
                    Website ↗
                  </Link>
                )}
                {show.instagram_url && (
                  <Link
                    href={show.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                  >
                    Instagram ↗
                  </Link>
                )}
                {show.facebook_url && (
                  <Link
                    href={show.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                  >
                    Facebook ↗
                  </Link>
                )}
                {show.social_url && !show.instagram_url && !show.facebook_url && (
                  <Link
                    href={show.social_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                  >
                    Social ↗
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} DMV TCG Shows &mdash; Built for the
        DMV collecting community.
      </footer>
    </div>
  );
}
