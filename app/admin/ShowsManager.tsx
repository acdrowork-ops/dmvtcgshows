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

  if (shows.length === 0) {
    return <p className="text-sm text-gray-400">No shows yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {deleteError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-200">
          {deleteError}
        </div>
      )}

      {shows.map((show) => (
        <div
          key={show.id}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
        >
          {/* Summary row */}
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">{show.name}</p>
              <p className="mt-0.5 text-xs text-gray-400">
                {show.date} &middot; {show.city}, {show.state} &middot;{" "}
                {show.show_type}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                onClick={() =>
                  setEditingId(editingId === show.id ? null : show.id)
                }
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-indigo-300 hover:text-indigo-600"
              >
                {editingId === show.id ? "Cancel" : "Edit"}
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

          {/* Inline edit form */}
          {editingId === show.id && (
            <div className="border-t border-gray-100 px-5 py-6">
              <EditShowForm show={show} onSaved={handleSaved} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
