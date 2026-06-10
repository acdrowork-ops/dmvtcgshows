"use client";

import { useState } from "react";
import { SuggestShowModal } from "./SuggestShowModal";

export function SuggestShowButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open && <SuggestShowModal onClose={() => setOpen(false)} />}
    </>
  );
}
