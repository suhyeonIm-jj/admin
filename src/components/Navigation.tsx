"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/personal", label: "Personal" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-[var(--card-bg)] border-b border-[var(--card-border)] shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-lg font-bold text-[var(--primary)]">
            Admin Hub
          </Link>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-border)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
