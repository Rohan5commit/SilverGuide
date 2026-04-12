import { SessionSummary } from "@/components/session-summary";

export default function SummaryPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="max-w-4xl rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-8 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Session Summary</p>
        <h1 className="mt-2 font-display text-5xl text-[color:var(--ink-strong)]">A short recap you can use right away</h1>
        <p className="mt-4 text-xl leading-9 text-[color:var(--ink-muted)]">
          After each practice session, SilverGuide keeps the key lessons in a simple format that learners, volunteers, and staff can revisit.
        </p>
      </section>

      <SessionSummary />
    </main>
  );
}
