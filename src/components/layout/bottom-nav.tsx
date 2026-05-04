"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/dashboard?tab=tasks", label: "Tasks", icon: "✓" },
  { href: "/dashboard?tab=calendar", label: "Calendar", icon: "📅" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href ||
    (href === "/dashboard" && pathname.includes("/dashboard"));

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-4 py-2 sm:hidden">
      <div className="flex items-center justify-around max-w-full">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
              isActive(item.href)
                ? "text-purple-400 bg-purple-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
