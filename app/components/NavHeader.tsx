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
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900"
          >
            DMV TCG Shows
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
