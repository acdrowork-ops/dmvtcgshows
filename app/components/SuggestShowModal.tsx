"use client";

import { useActionState, useEffect } from "react";
import {
  submitSuggestion,
  type SuggestionState,
} from "@/app/actions/suggestions";

export function SuggestShowModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState<SuggestionState, FormData>(
    submitSuggestion,
    undefined
  );

  useEffect(() => {
    if (state && "success" in state) {
      const t = setTimeout(onClose, 1500);
      return () => clearTimeout(t);
    }
  }, [state, onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="suggest-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2
              id="suggest-modal-title"
              className="text-xl font-bold text-gray-900"
            >
              Suggest a Show
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Know a show we&apos;re missing or have a correction? Let us know.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 rounded p-1 text-gray-400 transition-colors hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {state && "success" in state ? (
          <div className="rounded-lg bg-emerald-50 px-4 py-5 text-center">
            <p className="font-semibold text-emerald-700">
              Thanks! We&apos;ll take a look.
            </p>
          </div>
        ) : (
          <form action={action} className="flex flex-col gap-4">
            {state && "error" in state && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {state.error}
              </p>
            )}

            <div>
              <label
                htmlFor="suggest-show-name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Show Name <span className="text-red-500">*</span>
              </label>
              <input
                id="suggest-show-name"
                name="show_name"
                type="text"
                required
                placeholder="e.g. Northern Virginia Pokémon Show"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="suggest-show-date"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Show Date
              </label>
              <input
                id="suggest-show-date"
                name="show_date"
                type="text"
                placeholder="e.g. July 4, 2026"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="suggest-website"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Website or Social Link
              </label>
              <input
                id="suggest-website"
                name="website_or_social"
                type="text"
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="suggest-notes"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Additional Notes
              </label>
              <textarea
                id="suggest-notes"
                name="notes"
                rows={3}
                placeholder="Location, correction details, anything else useful…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="suggest-name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Your Name{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                id="suggest-name"
                name="submitter_name"
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-400 disabled:opacity-60"
            >
              {pending ? "Submitting…" : "Submit Suggestion"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
