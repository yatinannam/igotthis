"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type PendingButtonProps = {
  children: ReactNode;
  pendingLabel: string;
  className?: string;
};

export function PendingButton({
  children,
  pendingLabel,
  className = "",
}: PendingButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
