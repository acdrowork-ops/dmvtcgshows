"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { updateShow, type ShowState } from "@/app/admin/actions";
import type { Show } from "@/lib/supabase";

const FIELD =
  "rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white";
const LABEL = "text-sm font-medium text-gray-700";

const DMV_STATES = ["DC", "MD", "VA"];
const SHOW_TYPES = [
  "TCG",
  "Pokemon",
  "Magic: The Gathering",
  "Yu-Gi-Oh!",
  "One Piece",
  "Lorcana",
  "Digimon",
  "Mixed",
  "Sports",
];

type OrgEntry = {
  _id: number;
  name: string;
  website_url: string;
  instagram_url: string;
  facebook_url: string;
};

export function EditShowForm({
  show,
  onSaved,
}: {
  show: Show;
  onSaved: () => void;
}) {
  const [state, action, isPending] = useActionState<ShowState, FormData>(
    updateShow,
    undefined
  );

  const initialOrgs = (show.organizers ?? []).map((org, i) => ({
    _id: i,
    name: org.name ?? "",
    website_url: org.website_url ?? "",
    instagram_url: org.instagram_url ?? "",
    facebook_url: org.facebook_url ?? "",
  }));
  const [extraOrgs, setExtraOrgs] = useState<OrgEntry[]>(initialOrgs);
  const orgIdRef = useRef(initialOrgs.length);

  useEffect(() => {
    if (state && "success" in state) onSaved();
  }, [state, onSaved]);

  const addOrg = () => {
    orgIdRef.current += 1;
    setExtraOrgs((prev) => [
      ...prev,
      { _id: orgIdRef.current, name: "", website_url: "", instagram_url: "", facebook_url: "" },
    ]);
  };

  const removeOrg = (id: number) =>
    setExtraOrgs((prev) => prev.filter((o) => o._id !== id));

  const updateOrg = (id: number, field: keyof Omit<OrgEntry, "_id">, value: string) =>
    setExtraOrgs((prev) =>
      prev.map((o) => (o._id === id ? { ...o, [field]: value } : o))
    );

  const orgsPayload = extraOrgs.map(({ name, website_url, instagram_url, facebook_url }) => ({
    name,
    website_url,
    instagram_url,
    facebook_url,
  }));

  // Unique id prefix prevents duplicate htmlFor when multiple edit forms mount
  const f = (name: string) => `edit-${show.id}-${name}`;

  return (
    <div>
      {state && "error" in state && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200">
          {state.error}
        </div>
      )}

      <form action={action} className="flex flex-col gap-6">
        <input type="hidden" name="id" value={show.id} />
        <input type="hidden" name="organizers" value={JSON.stringify(orgsPayload)} />

        {/* Show details */}
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="col-span-full mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Show details
          </legend>

          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label htmlFor={f("name")} className={LABEL}>
              Show name <span className="text-red-400">*</span>
            </label>
            <input
              id={f("name")}
              name="name"
              type="text"
              required
              defaultValue={show.name}
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("date")} className={LABEL}>
              Start date <span className="text-red-400">*</span>
            </label>
            <input
              id={f("date")}
              name="date"
              type="date"
              required
              defaultValue={show.date}
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("end_date")} className={LABEL}>
              End date
            </label>
            <input
              id={f("end_date")}
              name="end_date"
              type="date"
              defaultValue={show.end_date ?? ""}
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("show_type")} className={LABEL}>
              Show type <span className="text-red-400">*</span>
            </label>
            <select
              id={f("show_type")}
              name="show_type"
              required
              defaultValue={show.show_type}
              className={FIELD}
            >
              {SHOW_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("start_time")} className={LABEL}>
              Start time <span className="text-red-400">*</span>
            </label>
            <input
              id={f("start_time")}
              name="start_time"
              type="time"
              required
              defaultValue={show.start_time ?? ""}
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("end_time")} className={LABEL}>
              End time
            </label>
            <input
              id={f("end_time")}
              name="end_time"
              type="time"
              defaultValue={show.end_time ?? ""}
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("entry_fee")} className={LABEL}>
              Entry fee
            </label>
            <input
              id={f("entry_fee")}
              name="entry_fee"
              type="text"
              placeholder="e.g. Free or $5"
              defaultValue={show.entry_fee ?? ""}
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
            <label htmlFor={f("venue")} className={LABEL}>
              Venue <span className="text-red-400">*</span>
            </label>
            <input
              id={f("venue")}
              name="venue"
              type="text"
              required
              defaultValue={show.venue}
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("city")} className={LABEL}>
              City <span className="text-red-400">*</span>
            </label>
            <input
              id={f("city")}
              name="city"
              type="text"
              required
              defaultValue={show.city}
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("state")} className={LABEL}>
              State <span className="text-red-400">*</span>
            </label>
            <select
              id={f("state")}
              name="state"
              required
              defaultValue={show.state}
              className={FIELD}
            >
              {DMV_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
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
            <label htmlFor={f("organizer")} className={LABEL}>
              Organizer
            </label>
            <input
              id={f("organizer")}
              name="organizer"
              type="text"
              placeholder="e.g. DMV Pokémon Community"
              defaultValue={show.organizer ?? ""}
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("table_count")} className={LABEL}>
              Table count
            </label>
            <input
              id={f("table_count")}
              name="table_count"
              type="text"
              placeholder="e.g. 40+"
              defaultValue={show.table_count ?? ""}
              className={FIELD}
            />
          </div>
        </fieldset>

        {/* Additional organizers */}
        {extraOrgs.length > 0 && (
          <div className="flex flex-col gap-4">
            {extraOrgs.map((org, idx) => (
              <fieldset
                key={org._id}
                className="grid gap-4 sm:grid-cols-2 rounded-xl border border-dashed border-gray-300 p-4"
              >
                <div className="col-span-full flex items-center justify-between">
                  <legend className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Additional organizer {idx + 1}
                  </legend>
                  <button
                    type="button"
                    onClick={() => removeOrg(org._id)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Remove
                  </button>
                </div>

                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className={LABEL}>Organizer name</label>
                  <input
                    type="text"
                    placeholder="e.g. Another TCG Club"
                    value={org.name}
                    onChange={(e) => updateOrg(org._id, "name", e.target.value)}
                    className={FIELD}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL}>Website URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={org.website_url}
                    onChange={(e) => updateOrg(org._id, "website_url", e.target.value)}
                    className={FIELD}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL}>Instagram URL</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/..."
                    value={org.instagram_url}
                    onChange={(e) => updateOrg(org._id, "instagram_url", e.target.value)}
                    className={FIELD}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL}>Facebook URL</label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={org.facebook_url}
                    onChange={(e) => updateOrg(org._id, "facebook_url", e.target.value)}
                    className={FIELD}
                  />
                </div>
              </fieldset>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addOrg}
          className="self-start text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          + Add Organizer
        </button>

        {/* Links */}
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="col-span-full mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Links
          </legend>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("website_url")} className={LABEL}>
              Website URL
            </label>
            <input
              id={f("website_url")}
              name="website_url"
              type="url"
              placeholder="https://..."
              defaultValue={show.website_url ?? ""}
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("instagram_url")} className={LABEL}>
              Instagram URL
            </label>
            <input
              id={f("instagram_url")}
              name="instagram_url"
              type="url"
              placeholder="https://instagram.com/..."
              defaultValue={show.instagram_url ?? ""}
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("facebook_url")} className={LABEL}>
              Facebook URL
            </label>
            <input
              id={f("facebook_url")}
              name="facebook_url"
              type="url"
              placeholder="https://facebook.com/..."
              defaultValue={show.facebook_url ?? ""}
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
            <label htmlFor={f("notes")} className={LABEL}>
              Additional notes
            </label>
            <textarea
              id={f("notes")}
              name="notes"
              rows={3}
              placeholder="Parking info, what to bring, special rules…"
              defaultValue={show.notes ?? ""}
              className={`${FIELD} resize-y`}
            />
          </div>
        </fieldset>

        {/* Flyer */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Flyer image
          </legend>
          {show.flyer_image_url && (
            <div className="mb-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={show.flyer_image_url}
                alt="Current flyer"
                className="h-20 w-auto rounded-lg border border-gray-200 object-cover"
              />
              <p className="mt-1 text-xs text-gray-400">
                Upload a new image to replace the current flyer
              </p>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label htmlFor={f("flyer")} className={LABEL}>
              {show.flyer_image_url ? "Replace flyer" : "Upload flyer"}
            </label>
            <input
              id={f("flyer")}
              name="flyer"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="text-xs text-gray-400">
              JPEG, PNG, WebP or GIF · max 5 MB
            </p>
          </div>
        </fieldset>

        {/* Flags */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Flags
          </legend>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="is_recurring"
              defaultChecked={show.is_recurring}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Recurring show</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="is_first_event"
              defaultChecked={show.is_first_event}
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
            {isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
