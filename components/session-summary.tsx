"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CalendarClock, RotateCcw } from "lucide-react";
import { readStoredSessionSummary, SESSION_SUMMARY_STORAGE_KEY } from "@/components/practice-quiz";

function readStoredSessionSummarySnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(SESSION_SUMMARY_STORAGE_KEY) ?? "";
}

export function SessionSummary() {
  const summarySnapshot = useSyncExternalStore(
    () => () => undefined,
    readStoredSessionSummarySnapshot,
    () => ""
  );
  const summary = summarySnapshot ? readStoredSessionSummary() : null;

  if (!summary) {
    return (
      <section className="rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <h2 className="font-display text-4xl text-[color:var(--ink-strong)]">No practice summary yet</h2>
        <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">
          Start Practice Mode to create a friendly session recap.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/practice"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
          >
            Start Practice Mode
          </Link>
          <Link
            href="/modules"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-white px-5 py-3 text-lg font-semibold text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
          >
            Back to modules
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Session summary</p>
            <h2 className="mt-2 font-display text-4xl text-[color:var(--ink-strong)]">What you practiced today</h2>
            <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">
              {summary.encouragement}
            </p>
          </div>
          <div className="rounded-3xl bg-[color:var(--panel-soft)] px-5 py-4 text-base font-medium text-[color:var(--ink-strong)]">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              {summary.firstTryCorrect} of {summary.total} remembered on the first try
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-[1.75rem] border border-[color:var(--border-soft)] bg-white p-5 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
          <h3 className="text-2xl font-semibold text-[color:var(--ink-strong)]">What you learned</h3>
          <ul className="mt-4 space-y-3 text-lg leading-8 text-[color:var(--ink-muted)]">
            {summary.learned.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[1.75rem] border border-[color:var(--border-soft)] bg-white p-5 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
          <h3 className="text-2xl font-semibold text-[color:var(--ink-strong)]">What to remember</h3>
          <ul className="mt-4 space-y-3 text-lg leading-8 text-[color:var(--ink-muted)]">
            {summary.remember.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[1.75rem] border border-[color:var(--border-soft)] bg-white p-5 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
          <h3 className="text-2xl font-semibold text-[color:var(--ink-strong)]">What to watch out for</h3>
          <ul className="mt-4 space-y-3 text-lg leading-8 text-[color:var(--ink-muted)]">
            {summary.watchOutFor.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/practice"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
        >
          <RotateCcw className="h-5 w-5" />
          Practice again
        </Link>
        <Link
          href="/modules"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-white px-5 py-3 text-lg font-semibold text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
        >
          Back to modules
        </Link>
      </div>
    </section>
  );
}
