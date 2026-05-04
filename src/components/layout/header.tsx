"use client";

import Link from "next/link";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  rightAction,
}: HeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800/50 py-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4 w-full">
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-white transition-colors"
            >
              ←
            </Link>
          )}
          <div>
            {title && <h1 className="text-xl font-bold text-white">{title}</h1>}
            {subtitle && (
              <p className="text-sm text-slate-400 -mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </div>
  );
}
