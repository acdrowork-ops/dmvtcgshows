import Link from "next/link";
import { NavHeader } from "@/app/components/NavHeader";
import { SuggestShowButton } from "@/app/components/SuggestShowButton";

export const metadata = {
  title: "About — DMV TCG Shows",
  description:
    "Learn about DMV TCG Shows, the community-driven directory of Trading Card Game events in the DC, Maryland, and Virginia area.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <NavHeader showsHref="/#upcoming" />

      <main className="flex flex-col flex-1 bg-gray-50">
        <div className="mx-auto w-full max-w-4xl px-6 py-16">
          {/* Page heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              About
            </h1>
            <p className="mt-3 text-lg text-gray-500">
              Everything you need to know about this site.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* What this site is */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                What is DMV TCG Shows?
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                DMV TCG Shows is a community-driven directory of Trading Card
                Game shows, vendor events, and conventions happening across the
                DC, Maryland, and Virginia area. The goal is simple: make it
                easy for collectors, players, and first-time attendees to find
                local events without having to dig through Facebook groups,
                Discord servers, or scattered flyers.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                Whether you play Pokémon, Magic: The Gathering, One Piece,
                Lorcana, Yu-Gi-Oh!, or anything else&mdash;if it&apos;s a card
                show in the DMV, it belongs here.
              </p>
            </div>

            {/* Who built it */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Who built it?</h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                This site was built by a local collector based in Northern
                Virginia who attends shows across the DMV area almost every
                weekend. After spending too much time trying to track down show
                dates and locations scattered across social media, it became
                clear that the DMV collecting community needed a single,
                easy-to-use resource.
              </p>
            </div>

            {/* How shows get listed */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                How do shows get listed?
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                Shows are curated and added manually by the site owner. Each
                listing is verified before it goes live to make sure the details
                are accurate and up to date.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                Know about a show that isn&apos;t listed, or noticed something
                that needs correcting? Use the suggestion form&mdash;it goes
                directly to the site owner for review.
              </p>
              <SuggestShowButton className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-400">
                Suggest a Show
              </SuggestShowButton>
            </div>

            {/* For organizers */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Are you a show organizer?
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                If you run a TCG show or vendor event in the DMV area and want
                it listed here, please reach out. Getting listed is free and
                helps connect your event with collectors who are actively
                looking for shows to attend.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                Use the suggestion form below and include as many details as
                you&apos;d like&mdash;date, venue, website, social links,
                whatever you have. We&apos;ll take it from there.
              </p>
              <SuggestShowButton className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-blue-300 hover:text-blue-600">
                Get Your Show Listed
              </SuggestShowButton>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900"
            >
              ← Back to all shows
            </Link>
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
