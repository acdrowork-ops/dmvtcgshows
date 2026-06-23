"use client";

import { useState } from "react";
import Link from "next/link";
import type { Show } from "@/lib/supabase";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildCells(year: number, month: number): (number | null)[] {
  const startDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function showsOnDate(shows: Show[], dateStr: string): Show[] {
  return shows.filter((s) => dateStr >= s.date && dateStr <= (s.end_date ?? s.date));
}

export function CalendarView({ shows }: { shows: Show[] }) {
  const now = new Date();
  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate());

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  }

  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth();

  const cells = buildCells(year, month);

  return (
    <div className="w-full">
      {/* Navigation bar */}
      <div className="mb-5 flex items-center gap-2">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-[#4F7FE8] hover:text-[#4F7FE8]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h2 className="flex-1 text-center text-base font-bold text-gray-900 sm:text-lg">
          {MONTH_NAMES[month]} {year}
        </h2>

        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-[#4F7FE8] hover:text-[#4F7FE8]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {!isCurrentMonth && (
          <button
            onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-[#4F7FE8] hover:text-[#4F7FE8]"
          >
            Today
          </button>
        )}
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 pb-2 mb-1">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:text-[11px]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200">
        {cells.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={idx}
                className="min-h-[72px] bg-gray-50 sm:min-h-[100px]"
              />
            );
          }

          const dateStr = toDateStr(year, month, day);
          const isToday = dateStr === todayStr;
          const isPast = dateStr < todayStr;
          const dayShows = showsOnDate(shows, dateStr);
          const visible = dayShows.slice(0, 2);
          const overflow = dayShows.length - visible.length;

          return (
            <div
              key={idx}
              className={`flex min-h-[72px] flex-col gap-0.5 p-1 sm:min-h-[100px] sm:p-2 ${
                isPast ? "bg-gray-50" : "bg-white"
              }`}
            >
              {/* Day number */}
              <div className="mb-0.5 flex justify-end">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium sm:h-6 sm:w-6 sm:text-xs ${
                    isToday
                      ? "bg-[#4F7FE8] font-bold text-white"
                      : isPast
                      ? "text-gray-300"
                      : "text-gray-600"
                  }`}
                >
                  {day}
                </span>
              </div>

              {/* Show pills */}
              <div className="flex flex-col gap-0.5">
                {visible.map((show) => (
                  <Link
                    key={show.id}
                    href={`/shows/${show.id}`}
                    title={show.name}
                    className="block truncate rounded px-1 py-px text-[9px] font-medium leading-4 text-white transition-opacity hover:opacity-80 sm:text-[11px]"
                    style={{ backgroundColor: "#4F7FE8" }}
                  >
                    {show.name}
                  </Link>
                ))}
                {overflow > 0 && (
                  <span className="px-1 text-[9px] text-gray-400 sm:text-[10px]">
                    +{overflow} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
