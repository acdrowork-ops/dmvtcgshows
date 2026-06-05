"use client";

import { useActionState, useEffect, useState } from "react";
import { addShow, type ShowState } from "@/app/admin/actions";

const FIELD = "rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white";
const LABEL = "text-sm font-medium text-gray-700";

const DMV_STATES = ["DC", "MD", "VA"];
const SHOW_TYPES = ["TCG", "Pokemon", "Magic: The Gathering", "Yu-Gi-Oh!", "One Piece", "Lorcana", "Digimon", "Mixed", "Sports"];

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
        {/* Show details */}
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
            <label htmlFor="start_time" className={LABEL}>
              Start time <span className="text-red-400">*</span>
            </label>
            <input id="start_time" name="start_time" type="time" required className={FIELD} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="end_time" className={LABEL}>
              End time
            </label>
            <input id="end_time" name="end_time" type="time" className={FIELD} />
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
            <label htmlFor="instagram_url" className={LABEL}>
              Instagram URL
            </label>
            <input
              id="instagram_url"
              name="instagram_url"
              type="url"
              placeholder="https://instagram.com/..."
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="facebook_url" className={LABEL}>
              Facebook URL
            </label>
            <input
              id="facebook_url"
              name="facebook_url"
              type="url"
              placeholder="https://facebook.com/..."
              className={FIELD}
            />
          </div>
        </fieldset>

        {/* Notes */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Notes
          </legend>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className={LABEL}>
              Additional notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Parking info, what to bring, special rules…"
              className={`${FIELD} resize-y`}
            />
          </div>
        </fieldset>

        {/* Flyer */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Flyer image
          </legend>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="flyer" className={LABEL}>
              Upload flyer
            </label>
            <input
              id="flyer"
              name="flyer"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="text-xs text-gray-400">JPEG, PNG, WebP or GIF · max 5 MB</p>
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
