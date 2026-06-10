"use client";

import { useState } from "react";
import Link from "next/link";
import { SuggestShowModal } from "./SuggestShowModal";

export function NavHeader({ showsHref = "#upcoming" }: { showsHref?: string }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <svg
              width="28"
              height="24"
              viewBox="0 0 28 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="0" y="4" width="13" height="17" rx="2"
                fill="#4F7FE8" fillOpacity="0.38"
                transform="rotate(-14 6.5 12.5)"
              />
              <rect
                x="15" y="4" width="13" height="17" rx="2"
                fill="#4F7FE8" fillOpacity="0.38"
                transform="rotate(14 21.5 12.5)"
              />
              <rect x="7" y="2" width="14" height="18" rx="2" fill="#4F7FE8" />
              <circle cx="14" cy="11" r="2.5" fill="white" fillOpacity="0.9" />
            </svg>
            <span className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                DMV TCG
              </span>
              <span className="text-base font-medium text-gray-400">Shows</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link
              href={showsHref}
              className="transition-colors hover:text-gray-900"
            >
              Shows
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              className="transition-colors hover:text-gray-900"
            >
              Suggest a Show
            </button>
            <Link href="/about" className="transition-colors hover:text-gray-900">
              About
            </Link>
          </nav>
        </div>
      </header>

      {modalOpen && <SuggestShowModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
