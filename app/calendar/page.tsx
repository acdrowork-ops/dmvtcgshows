import type { Metadata } from "next";
import { getShows } from "@/lib/supabase";
import { NavHeader } from "@/app/components/NavHeader";
import { CalendarView } from "@/app/components/CalendarView";

export const metadata: Metadata = {
  title: "Calendar | DMV TCG Shows",
  description:
    "Browse upcoming Trading Card Game shows in the DC, Maryland, and Virginia area by month.",
};

export const revalidate = 60;

export default async function CalendarPage() {
  const shows = await getShows();

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <NavHeader showsHref="/#upcoming" />

      <main className="flex-1 bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Calendar
            </h1>
            <p className="mt-2 text-gray-500">
              Upcoming TCG shows across the DMV, by month.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <CalendarView shows={shows} />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-gray-50 px-6 py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} DMV TCG Shows &mdash; Built for the
        DMV collecting community.
      </footer>
    </div>
  );
}
