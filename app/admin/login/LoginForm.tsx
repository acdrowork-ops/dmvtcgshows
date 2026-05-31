"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/admin/actions";
import Link from "next/link";

export function LoginForm() {
  const [state, action, isPending] = useActionState<AuthState, FormData>(
    signIn,
    undefined
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
            DMV TCG Shows
          </Link>
          <span className="ml-3 text-sm text-gray-400">/ Admin</span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Admin sign in</h1>
          <p className="mb-8 text-sm text-gray-500">
            Sign in to manage TCG shows.
          </p>

          <form action={action} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-1 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 disabled:opacity-60"
            >
              {isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
