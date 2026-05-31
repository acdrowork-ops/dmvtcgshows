"use client";

import { useActionState, useEffect, useState } from "react";
import { addShow, type ShowState } from "@/app/admin/actions";

const FIELD = "rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white";
const LABEL = "text-sm font-medium text-gray-700";

const DMV_STATES = ["DC", "MD", "VA"];
const SHOW_TYPES = ["TCG", "Pokemon", "Magic: The Gathering", "Yu-Gi-Oh!", "One Piece", "Lorcana", "Digimon", "Mixed"];

export function AddShowForm() {
  const [state, action, isPending] = useActionState<ShowState, FormData>(
    addShow,
    undefined
  );
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state && "success" in state) setFormKey((k) => k + 1);
  }, [state]);

  return (
    <div>
      {state && "success" in state && (
        <div className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          Show added successfully!
        </div>
      )}
      {state && "error" in state && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200">
          {state.error}
        </div>
      )}

      <form key={formKey} action={action} className="flex flex-col gap-6">
        {/* Required fields */}
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="col-span-full mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Show details
          </legend>

          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="name" className={LABEL}>
              Show name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. DMV Pokémon Card Swap & Sell"
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="date" className={LABEL}>
              Date <span className="text-red-400">*</span>
            </label>
            <input id="date" name="date" type="date" required className={FIELD} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="time" className={LABEL}>
              Time <span className="text-red-400">*</span>
            </label>
            <input id="time" name="time" type="time" required className={FIELD} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="show_type" className={LABEL}>
              Show type <span className="text-red-400">*</span>
            </label>
            <select id="show_type" name="show_type" required className={FIELD}>
              {SHOW_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="entry_fee" className={LABEL}>
              Entry fee
            </label>
            <input
              id="entry_fee"
              name="entry_fee"
              type="text"
              placeholder="e.g. Free or $5"
              className={FIELD}
            />
          </div>
        </fieldset>

        {/* Location */}
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="col-span-full mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Location
          </legend>

          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="venue" className={LABEL}>
              Venue <span className="text-red-400">*</span>
            </label>
            <input
              id="venue"
              name="venue"
              type="text"
              required
              placeholder="e.g. Rockville Civic Center"
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="city" className={LABEL}>
              City <span className="text-red-400">*</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              placeholder="e.g. Rockville"
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="state" className={LABEL}>
              State <span className="text-red-400">*</span>
            </label>
            <select id="state" name="state" required className={FIELD}>
              {DMV_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </fieldset>

        {/* Organizer / capacity */}
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="col-span-full mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Organizer &amp; capacity
          </legend>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="organizer" className={LABEL}>
              Organizer
            </label>
            <input
              id="organizer"
              name="organizer"
              type="text"
              placeholder="e.g. DMV Pokémon Community"
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="table_count" className={LABEL}>
              Table count
            </label>
            <input
              id="table_count"
              name="table_count"
              type="text"
              placeholder="e.g. 40+"
              className={FIELD}
            />
          </div>
        </fieldset>

        {/* Links */}
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="col-span-full mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Links
          </legend>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="website_url" className={LABEL}>
              Website URL
            </label>
            <input
              id="website_url"
              name="website_url"
              type="url"
              placeholder="https://..."
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="social_url" className={LABEL}>
              Social URL
            </label>
            <input
              id="social_url"
              name="social_url"
              type="url"
              placeholder="https://facebook.com/..."
              className={FIELD}
            />
          </div>
        </fieldset>

        {/* Flags */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Flags
          </legend>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_recurring"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Recurring show</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_first_event"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">First event</span>
          </label>
        </fieldset>

        <div className="border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 disabled:opacity-60"
          >
            {isPending ? "Adding show…" : "Add show"}
          </button>
        </div>
      </form>
    </div>
  );
}
