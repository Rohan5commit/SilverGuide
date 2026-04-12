import { PracticeQuiz } from "@/components/practice-quiz";

export default function PracticePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="max-w-4xl rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-8 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Practice Mode</p>
        <h1 className="mt-2 font-display text-5xl text-[color:var(--ink-strong)]">Replay short scenarios and learn through gentle feedback.</h1>
        <p className="mt-4 text-xl leading-9 text-[color:var(--ink-muted)]">
          One question per screen. Large touch targets. No harsh wording. Just quick practice and a useful summary at the end.
        </p>
      </section>

      <PracticeQuiz />
    </main>
  );
}
