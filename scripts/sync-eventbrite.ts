/**
 * Fetch upcoming TCG/card show events from known Eventbrite organizers and
 * print them for review before any database import.
 *
 * WHY NOT /v3/events/search/:
 *   Eventbrite permanently shut down their public event search API on
 *   Feb 20, 2020. Calling it returns 404. There is no API endpoint for
 *   searching events by keyword or location across all of Eventbrite.
 *
 * WHAT WORKS INSTEAD:
 *   GET /v3/organizations/:id/events/
 *   Fetches all upcoming events for a specific Eventbrite organizer.
 *
 * HOW TO FIND AN ORGANIZER ID:
 *   Go to the organizer's Eventbrite page, e.g.:
 *     https://www.eventbrite.com/o/dmv-card-collectors-12345678901
 *   The trailing number is the organization ID. Add it to ORG_IDS below.
 *
 * Run: npm run sync-eventbrite
 * Requires: EVENTBRITE_API_KEY in .env.local (or set in the environment)
 */

import { resolve } from "path";
import * as dotenv from "dotenv";

// tsx does not auto-load .env.local the way Next.js does — use dotenv.
// override: true ensures .env.local always wins over any stale shell value.
dotenv.config({ path: resolve(process.cwd(), ".env.local"), override: true });

const API_KEY = process.env.EVENTBRITE_API_KEY?.trim();
const TARGET_STATES = new Set(["VA", "MD", "DC"]);

// ── Add Eventbrite organization IDs for DMV TCG event organizers here ─────────
// Each entry is: [display label, org ID]
const ORG_IDS: [string, string][] = [
  ["Offsidez TCG", "121141959020"],
  ["JM's GARAGE", "121175931172"],
  ["Tidewater Cards and Collectibles","121188417972"]
];
// ─────────────────────────────────────────────────────────────────────────────

// ── Eventbrite API shapes ─────────────────────────────────────────────────────

interface EbAddress {
  city?: string;
  region?: string; // state/province code
  country?: string;
}

interface EbVenue {
  name?: string;
  address?: EbAddress;
}

interface EbOrganizer {
  name?: string;
}

interface EbLogo {
  url?: string;
  original?: { url?: string };
}

interface EbMoney {
  display: string;
  currency: string;
  value: number;
}

interface EbTicketClass {
  name: string;
  free: boolean;
  cost?: EbMoney;
}

interface EbDateTime {
  local: string; // "2026-06-14T10:00:00"
  utc: string;
  timezone: string;
}

interface EbEvent {
  id: string;
  name: { text: string };
  description: { text: string } | null;
  start: EbDateTime;
  end: EbDateTime;
  url: string;
  logo?: EbLogo;
  venue?: EbVenue;
  organizer?: EbOrganizer;
  ticket_classes?: EbTicketClass[];
}

interface EbOrgEventsResponse {
  events: EbEvent[];
  pagination: {
    page_number: number;
    page_count: number;
    has_more_items: boolean;
    continuation?: string;
  };
  error?: string;
  error_description?: string;
}

// ── Extracted shape ───────────────────────────────────────────────────────────

interface ExtractedShow {
  eventbrite_id: string;
  name: string;
  description: string | null;
  start_date: string;   // YYYY-MM-DD
  end_date: string | null;
  start_time: string;   // HH:MM
  end_time: string | null;
  venue_name: string;
  city: string;
  state: string;
  entry_fee: string | null;
  organizer_name: string | null;
  event_url: string;
  image_url: string | null;
}

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchOrgEventsPage(
  orgId: string,
  continuation?: string
): Promise<EbOrgEventsResponse> {
  const params = new URLSearchParams({
    expand: "venue,organizer,logo,ticket_classes",
    time_filter: "current_future",
    status: "live",
    order_by: "start_asc",
  });
  if (continuation) params.set("continuation", continuation);

  const res = await fetch(
    `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?${params}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
    }
  );

  const body = (await res.json()) as EbOrgEventsResponse;

  if (!res.ok) {
    throw new Error(
      `Eventbrite ${res.status}: ${body.error ?? ""} – ${body.error_description ?? res.statusText}`
    );
  }

  return body;
}

async function fetchAllOrgEvents(orgId: string): Promise<EbEvent[]> {
  const events: EbEvent[] = [];
  let continuation: string | undefined;

  while (true) {
    const data = await fetchOrgEventsPage(orgId, continuation);
    events.push(...data.events);
    if (!data.pagination.has_more_items) break;
    continuation = data.pagination.continuation;
    if (!continuation) break;
  }

  return events;
}

// ── Extraction ────────────────────────────────────────────────────────────────

function localDate(dt: string): string {
  return dt.split("T")[0];
}

function localTime(dt: string): string {
  return dt.split("T")[1]?.slice(0, 5) ?? "00:00";
}

function parseEntryFee(event: EbEvent): string | null {
  const classes = event.ticket_classes;
  if (!classes || classes.length === 0) return null;
  const first = classes[0];
  if (first.free) return "Free";
  if (first.cost) return first.cost.display;
  return null;
}

function toExtractedShow(event: EbEvent): ExtractedShow | null {
  const region = event.venue?.address?.region?.toUpperCase();
  if (!region || !TARGET_STATES.has(region)) return null;

  const startDate = localDate(event.start.local);
  const endDate = localDate(event.end.local);
  const startTime = localTime(event.start.local);
  const endTime = localTime(event.end.local);

  return {
    eventbrite_id: event.id,
    name: event.name.text,
    description: event.description?.text?.trim() || null,
    start_date: startDate,
    end_date: endDate !== startDate ? endDate : null,
    start_time: startTime,
    end_time: endTime !== startTime ? endTime : null,
    venue_name: event.venue?.name ?? "Unknown Venue",
    city: event.venue?.address?.city ?? "Unknown City",
    state: region,
    entry_fee: parseEntryFee(event),
    organizer_name: event.organizer?.name ?? null,
    event_url: event.url,
    image_url: event.logo?.original?.url ?? event.logo?.url ?? null,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!API_KEY) {
    console.error("Error: EVENTBRITE_API_KEY is not set.");
    console.error(
      "Check that EVENTBRITE_API_KEY is present in .env.local"
    );
    process.exit(1);
  }

  console.log(`API key loaded: ${API_KEY.slice(0, 4)}${"*".repeat(Math.max(0, API_KEY.length - 4))} (${API_KEY.length} chars)`);


  if (ORG_IDS.length === 0) {
    console.error("No organization IDs configured.");
    console.error(
      "Add Eventbrite org IDs to the ORG_IDS array at the top of this script."
    );
    console.error(
      "Find them from organizer URLs: https://www.eventbrite.com/o/org-name-XXXXXXXXXX"
    );
    process.exit(1);
  }

  console.log(
    `Fetching upcoming events from ${ORG_IDS.length} Eventbrite organizer(s)...\n`
  );

  const seenIds = new Set<string>();
  const rawEvents: EbEvent[] = [];

  for (const [label, orgId] of ORG_IDS) {
    process.stdout.write(`  ${label} (org ${orgId}) ... `);
    try {
      const events = await fetchAllOrgEvents(orgId);
      let added = 0;
      for (const ev of events) {
        if (!seenIds.has(ev.id)) {
          seenIds.add(ev.id);
          rawEvents.push(ev);
          added++;
        }
      }
      console.log(`${events.length} events fetched, ${added} unique`);
    } catch (err) {
      console.log(`ERROR – ${(err as Error).message}`);
    }
  }

  console.log(`\nTotal unique events fetched: ${rawEvents.length}`);

  const shows: ExtractedShow[] = rawEvents
    .map(toExtractedShow)
    .filter((s): s is ExtractedShow => s !== null)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  console.log(`Events in VA / MD / DC: ${shows.length}`);
  console.log("\n" + "═".repeat(72) + "\n");

  if (shows.length === 0) {
    console.log("No events found in VA, MD, or DC from the configured organizers.");
    return;
  }

  for (const [i, s] of shows.entries()) {
    const dateRange = s.end_date
      ? `${s.start_date} → ${s.end_date}`
      : s.start_date;
    const timeRange = s.end_time
      ? `${s.start_time} – ${s.end_time}`
      : s.start_time;

    console.log(`[${String(i + 1).padStart(2, "0")}] ${s.name}`);
    console.log(`     Date:       ${dateRange}`);
    console.log(`     Time:       ${timeRange}`);
    console.log(`     Venue:      ${s.venue_name}`);
    console.log(`     Location:   ${s.city}, ${s.state}`);
    console.log(`     Entry Fee:  ${s.entry_fee ?? "(not listed)"}`);
    console.log(`     Organizer:  ${s.organizer_name ?? "(not listed)"}`);
    console.log(`     URL:        ${s.event_url}`);
    console.log(`     Image:      ${s.image_url ?? "(none)"}`);

    if (s.description) {
      const preview = s.description.replace(/\s+/g, " ").slice(0, 180);
      console.log(
        `     Desc:       ${preview}${s.description.length > 180 ? "…" : ""}`
      );
    }

    console.log();
  }

  console.log("═".repeat(72));
  console.log(`\n${shows.length} show(s) found. Review above before importing.`);
}

main().catch((err) => {
  console.error("\nFatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});
