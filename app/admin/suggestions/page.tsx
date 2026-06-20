import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut, markSuggestionReviewed } from "@/app/admin/actions";

type Suggestion = {
  id: string;
  show_name: string;
  show_date: string | null;
  website_or_social: string | null;
  notes: string | null;
  submitter_name: string | null;
  created_at: string;
  reviewed: boolean;
};

export default async function SuggestionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data } = await supabase
    .from("suggestions")
    .select("*")
    .order("reviewed", { ascending: true })
    .order("created_at", { ascending: false });

  const list: Suggestion[] = data ?? [];
  const unreviewedCount = list.filter((s) => !s.reviewed).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-gray-900"
            >
              DMV TCG Shows
            </Link>
            <span className="text-sm text-gray-400">/ Admin</span>
            <nav className="ml-2 flex items-center gap-1">
              <Link
                href="/admin"
                className="rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
              >
                Shows
              </Link>
              <Link
                href="/admin/suggestions"
                className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-900"
              >
                Suggestions
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="hidden text-sm text-gray-500 sm:block">
                {user.email}
              </span>
            )}
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Suggestions</h1>
            <p className="mt-1 text-sm text-gray-500">
              {list.length} suggestion{list.length !== 1 ? "s" : ""} total
              {unreviewedCount > 0 && `, ${unreviewedCount} unreviewed`}.
            </p>
          </div>

          {list.length === 0 ? (
            <p className="text-sm text-gray-500">No suggestions yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {list.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-2xl border bg-white p-6 shadow-sm transition-opacity ${
                    s.reviewed ? "border-gray-100 opacity-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-gray-900">
                          {s.show_name}
                        </h3>
                        {s.reviewed && (
                          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Reviewed
                          </span>
                        )}
                      </div>

                      <dl className="flex flex-col gap-1 text-sm text-gray-600">
                        {s.show_date && (
                          <div className="flex gap-2">
                            <dt className="shrink-0 font-medium text-gray-500">
                              Date
                            </dt>
                            <dd>{s.show_date}</dd>
                          </div>
                        )}
                        {s.website_or_social && (
                          <div className="flex gap-2">
                            <dt className="shrink-0 font-medium text-gray-500">
                              Link
                            </dt>
                            <dd className="truncate">
                              <a
                                href={s.website_or_social}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {s.website_or_social}
                              </a>
                            </dd>
                          </div>
                        )}
                        {s.notes && (
                          <div className="flex gap-2">
                            <dt className="shrink-0 font-medium text-gray-500">
                              Notes
                            </dt>
                            <dd className="whitespace-pre-wrap">{s.notes}</dd>
                          </div>
                        )}
                        {s.submitter_name && (
                          <div className="flex gap-2">
                            <dt className="shrink-0 font-medium text-gray-500">
                              From
                            </dt>
                            <dd>{s.submitter_name}</dd>
                          </div>
                        )}
                        <div className="mt-1 flex gap-2">
                          <dt className="shrink-0 font-medium text-gray-500">
                            Submitted
                          </dt>
                          <dd className="text-gray-400">
                            {new Date(s.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {!s.reviewed && (
                      <form
                        action={markSuggestionReviewed.bind(null, s.id)}
                        className="shrink-0"
                      >
                        <button
                          type="submit"
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
                        >
                          Mark as Reviewed
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
