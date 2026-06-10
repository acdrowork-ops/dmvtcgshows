"use client";

import { useState } from "react";
import Link from "next/link";
import type { Show } from "@/lib/supabase";
import { ShowCard } from "./ShowCard";

const TCG_TYPES = new Set([
  "TCG",
  "Pokemon",
  "Magic: The Gathering",
  "Yu-Gi-Oh!",
  "One Piece",
  "Lorcana",
  "Digimon",
]);

type StateFilter = "All" | "VA" | "MD" | "DC";
type TypeFilter = "All" | "TCG" | "Sports" | "Mixed";
type FeeFilter = "All" | "Free" | "Paid";

function isFree(entry_fee: string | null): boolean {
  if (!entry_fee) return true;
  const lower = entry_fee.toLowerCase().trim();
  return lower === "free" || lower === "$0" || lower === "0";
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-blue-500 text-white"
          : "border border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

export function ShowsWithFilters({ shows }: { shows: Show[] }) {
  const [stateFilter, setStateFilter] = useState<StateFilter>("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [feeFilter, setFeeFilter] = useState<FeeFilter>("All");

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
          className="mt-6 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
        >
          Submit a Show
        </Link>
      </div>
    );
  }

  const filtered = shows.filter((show) => {
    if (stateFilter !== "All" && show.state !== stateFilter) return false;
    if (typeFilter === "TCG" && !TCG_TYPES.has(show.show_type)) return false;
    if (typeFilter === "Sports" && show.show_type !== "Sports") return false;
    if (typeFilter === "Mixed" && show.show_type !== "Mixed") return false;
    if (feeFilter === "Free" && !isFree(show.entry_fee)) return false;
    if (feeFilter === "Paid" && isFree(show.entry_fee)) return false;
    return true;
  });

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-x-8 gap-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            State
          </span>
          {(["All", "VA", "MD", "DC"] as StateFilter[]).map((opt) => (
            <FilterButton
              key={opt}
              active={stateFilter === opt}
              onClick={() => setStateFilter(opt)}
            >
              {opt}
            </FilterButton>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Type
          </span>
          {(["All", "TCG", "Sports", "Mixed"] as TypeFilter[]).map((opt) => (
            <FilterButton
              key={opt}
              active={typeFilter === opt}
              onClick={() => setTypeFilter(opt)}
            >
              {opt}
            </FilterButton>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Entry
          </span>
          {(["All", "Free", "Paid"] as FeeFilter[]).map((opt) => (
            <FilterButton
              key={opt}
              active={feeFilter === opt}
              onClick={() => setFeeFilter(opt)}
            >
              {opt}
            </FilterButton>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <h3 className="text-base font-semibold text-gray-700">
            No shows match your filters
          </h3>
          <button
            onClick={() => {
              setStateFilter("All");
              setTypeFilter("All");
              setFeeFilter("All");
            }}
            className="mt-4 text-sm font-medium text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      )}
    </>
  );
}
