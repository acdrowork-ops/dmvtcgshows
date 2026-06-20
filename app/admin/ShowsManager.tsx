"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Show } from "@/lib/supabase";
import { deleteShow } from "@/app/admin/actions";
import { EditShowForm } from "@/app/admin/EditShowForm";

export function ShowsManager({ shows }: { shows: Show[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const today = new Date().toISOString().split("T")[0];

  const upcoming = shows
    .filter((s) => (s.end_date ?? s.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = shows
    .filter((s) => (s.end_date ?? s.date) < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteShow(id);
      if (result && "error" in result) {
        setDeleteError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleSaved() {
    setEditingId(null);
    router.refresh();
  }

  function renderShow(show: Show, past = false) {
    const isEditing = editingId === show.id;
    return (
      <div
        key={show.id}
        className={`overflow-hidden rounded-2xl border bg-white ${
          past ? "border-gray-100" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p
              className={`truncate font-semibold ${
                past ? "text-gray-400" : "text-gray-900"
              }`}
            >
              {show.name}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {show.date} &middot; {show.city}, {show.state} &middot;{" "}
              {show.show_type}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => setEditingId(isEditing ? null : show.id)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:text-indigo-600"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              onClick={() => handleDelete(show.id, show.name)}
              disabled={isPending}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="border-t border-gray-100 px-5 py-6">
            <EditShowForm show={show} onSaved={handleSaved} />
          </div>
        )}
      </div>
    );
  }

  if (shows.length === 0) {
    return <p className="text-sm text-gray-400">No shows yet.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {deleteError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200">
          {deleteError}
        </div>
      )}

      {/* Upcoming */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-700">
            Upcoming shows
          </h3>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
            {upcoming.length}
          </span>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-400">No upcoming shows.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((show) => renderShow(show, false))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <>
          <div className="border-t border-gray-200" />

          {/* Past */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-400">
                Past shows
              </h3>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400">
                {past.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {past.map((show) => renderShow(show, true))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
