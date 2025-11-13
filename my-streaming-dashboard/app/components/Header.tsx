"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "Series", href: "/series" },
  { label: "My List", href: "/my-list" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-semibold tracking-tight">
          StreamScope
        </Link>

        <nav className="hidden gap-6 text-sm text-neutral-300 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "text-white"
                    : "transition hover:text-white focus-visible:text-white"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium hover:border-white/40 hover:text-white">
            Log in
          </button>
          <button className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200 md:block">
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
}

