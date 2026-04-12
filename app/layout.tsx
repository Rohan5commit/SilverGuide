import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Newsreader } from "next/font/google";
import { PreferencesProvider } from "@/components/preferences-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const bodyFont = Atkinson_Hyperlegible({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const displayFont = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "SilverGuide",
  description: "A senior-friendly web coach for tech literacy, scam detection, and safe AI use.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable} h-full`}
    >
      <body className="min-h-full bg-[color:var(--surface)] text-[color:var(--ink-strong)] antialiased">
        <PreferencesProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(220,235,229,0.85),transparent_40%),radial-gradient(circle_at_top_right,rgba(246,232,219,0.75),transparent_32%),linear-gradient(180deg,rgba(252,250,244,1),rgba(246,248,246,1))]" />
            <SiteHeader />
            {children}
            <footer className="mt-12 border-t border-[color:var(--border-soft)] bg-[color:var(--footer-surface)]">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-base text-[color:var(--ink-soft)] sm:px-6 lg:px-8">
                <p>SilverGuide is designed for senior centers, volunteers, family helpers, and older adults building digital confidence.</p>
                <p>NVIDIA NIM powers optional AI help. Built-in lesson content keeps the app useful even when AI is unavailable.</p>
              </div>
            </footer>
          </div>
        </PreferencesProvider>
      </body>
    </html>
  );
}
