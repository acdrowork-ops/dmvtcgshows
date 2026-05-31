import type { Show } from "@/lib/supabase";
import Link from "next/link";

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ShowCard({ show }: { show: Show }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header row */}
      <div className="mb-3 flex flex-wrap items-start gap-2">
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

      <h3 className="mb-4 text-lg font-bold leading-snug text-gray-900">
        {show.name}
      </h3>

      <dl className="flex flex-col gap-2 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <dt className="w-4 shrink-0 text-base leading-5">📅</dt>
          <dd>
            {formatDate(show.date)} &mdash; {formatTime(show.time)}
          </dd>
        </div>

        <div className="flex items-start gap-2">
          <dt className="w-4 shrink-0 text-base leading-5">📍</dt>
          <dd>
            {show.venue}, {show.city}, {show.state}
          </dd>
        </div>

        {show.entry_fee && (
          <div className="flex items-start gap-2">
            <dt className="w-4 shrink-0 text-base leading-5">🎟</dt>
            <dd>Entry: {show.entry_fee}</dd>
          </div>
        )}

        {show.table_count && (
          <div className="flex items-start gap-2">
            <dt className="w-4 shrink-0 text-base leading-5">🪑</dt>
            <dd>{show.table_count} tables</dd>
          </div>
        )}

        {show.organizer && (
          <div className="flex items-start gap-2">
            <dt className="w-4 shrink-0 text-base leading-5">🧑‍💼</dt>
            <dd>{show.organizer}</dd>
          </div>
        )}
      </dl>

      {(show.website_url || show.social_url) && (
        <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4">
          {show.website_url && (
            <Link
              href={show.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              Website ↗
            </Link>
          )}
          {show.social_url && (
            <Link
              href={show.social_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              Social ↗
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
