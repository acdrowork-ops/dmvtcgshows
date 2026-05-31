import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/actions";
import { AddShowForm } from "@/app/admin/AddShowForm";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Hard auth guard — proxy does an optimistic cookie check; this validates the token.
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Nav */}
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
            <h1 className="text-2xl font-bold text-gray-900">Add a show</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to add a new TCG show to the directory.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <AddShowForm />
          </div>
        </div>
      </main>
    </div>
  );
}
