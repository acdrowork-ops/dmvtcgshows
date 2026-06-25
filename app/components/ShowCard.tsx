import { Fragment } from "react";
import type { Show } from "@/lib/supabase";
import Link from "next/link";

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateRange(start: string, end: string | null): string {
  const s = parseDate(start);
  if (!end) {
    return s.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  const e = parseDate(end);
  const startStr = s.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
  const endStr = e.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

function formatEntryFee(fee: string): string {
  const t = fee.trim();
  if (/^free$/i.test(t) || t.startsWith("$")) return t;
  return `$${t}`;
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

export function ShowCard({ show }: { show: Show }) {
  const timeRange = show.start_time
    ? show.end_time
      ? `${formatTime(show.start_time)} – ${formatTime(show.end_time)}`
      : formatTime(show.start_time)
    : "";

  const primaryHasLinks =
    show.website_url || show.instagram_url || show.facebook_url || show.social_url;

  const hasLinks =
    primaryHasLinks ||
    show.organizers?.some((o) => o.website_url || o.instagram_url || o.facebook_url);

  return (
    <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden">
      {show.flyer_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={show.flyer_image_url}
          alt=""
          className="h-48 w-full object-cover"
        />
      )}
      <div className="flex flex-col flex-1 p-6">
      {/* Header row */}
      <div className="mb-3 flex flex-wrap items-start gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700">
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
        <Link
          href={`/shows/${show.id}`}
          className="transition-colors hover:text-blue-600 before:absolute before:inset-0 before:content-['']"
        >
          {show.name}
        </Link>
      </h3>

      <dl className="flex flex-col gap-2 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <dt className="w-4 shrink-0 text-base leading-5">📅</dt>
          <dd>
            {formatDateRange(show.date, show.end_date)} &mdash; {timeRange}
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
            <dd>Entry: {formatEntryFee(show.entry_fee!)}</dd>
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

        {show.organizers?.map((org, i) =>
          org.name ? (
            <div key={i} className="flex items-start gap-2">
              <dt className="w-4 shrink-0 text-base leading-5">🧑‍💼</dt>
              <dd>{org.name}</dd>
            </div>
          ) : null
        )}
      </dl>

      {hasLinks && (
        <div className="relative z-10 mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
          {show.website_url && (
            <Link
              href={show.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Website ↗
            </Link>
          )}
          {show.instagram_url && (
            <Link
              href={show.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Instagram ↗
            </Link>
          )}
          {show.facebook_url && (
            <Link
              href={show.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Facebook ↗
            </Link>
          )}
          {show.social_url && !show.instagram_url && !show.facebook_url && (
            <Link
              href={show.social_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Social ↗
            </Link>
          )}
          {show.organizers?.map((org, i) => {
            const orgHasLinks = org.website_url || org.instagram_url || org.facebook_url;
            if (!orgHasLinks) return null;
            return (
              <Fragment key={i}>
                {primaryHasLinks && i === 0 && (
                  <span className="text-gray-300 select-none">·</span>
                )}
                {org.website_url && (
                  <Link
                    href={org.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Website ↗
                  </Link>
                )}
                {org.instagram_url && (
                  <Link
                    href={org.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Instagram ↗
                  </Link>
                )}
                {org.facebook_url && (
                  <Link
                    href={org.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Facebook ↗
                  </Link>
                )}
              </Fragment>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
