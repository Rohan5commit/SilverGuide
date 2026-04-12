"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonStar, SunMedium, Type } from "lucide-react";
import { usePreferences } from "@/components/preferences-provider";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/modules", label: "Modules" },
  { href: "/scam-shield", label: "Scam Shield" },
  { href: "/ai-practice", label: "AI Practice" },
  { href: "/everyday-tech", label: "Everyday Tech" },
  { href: "/practice", label: "Practice Mode" },
  { href: "/about", label: "How to use" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { largeText, setLargeText, theme, setTheme } = usePreferences();

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border-soft)] bg-[color:var(--surface)]/96 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3 rounded-full focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-xl font-semibold text-[color:var(--accent-ink)]">
              SG
            </span>
            <div>
              <p className="font-display text-2xl text-[color:var(--ink-strong)]">SilverGuide</p>
              <p className="text-sm text-[color:var(--ink-muted)]">A calm digital coach for seniors and senior centers</p>
            </div>
          </Link>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setLargeText(!largeText)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-white px-4 py-2 text-base font-medium text-[color:var(--ink-strong)] shadow-sm transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
              aria-pressed={largeText}
            >
              <Type className="h-5 w-5" />
              {largeText ? "Large text on" : "Reading mode"}
            </button>
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "soft-dark" : "light")}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-white px-4 py-2 text-base font-medium text-[color:var(--ink-strong)] shadow-sm transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
              aria-pressed={theme === "soft-dark"}
            >
              {theme === "soft-dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
              {theme === "soft-dark" ? "Light mode" : "Soft dark"}
            </button>
          </div>
        </div>

        <nav aria-label="Primary" className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-base font-medium transition focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] ${
                  active
                    ? "bg-[color:var(--accent)] text-white"
                    : "border border-[color:var(--border-soft)] bg-white text-[color:var(--ink-strong)] hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
