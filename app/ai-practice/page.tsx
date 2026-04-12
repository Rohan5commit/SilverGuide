import { AIPracticePanel } from "@/components/ai-practice-panel";
import { techLessons } from "@/lib/data";

const aiLesson = techLessons.find((lesson) => lesson.id === "use-chatgpt-safely");

export default function AIPracticePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="max-w-4xl rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-8 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">AI Practice</p>
        <h1 className="mt-2 font-display text-5xl text-[color:var(--ink-strong)]">Learn how to use AI as a helper without oversharing or overtrusting.</h1>
        <p className="mt-4 text-xl leading-9 text-[color:var(--ink-muted)]">
          SilverGuide teaches useful prompts, privacy habits, and verification steps so AI feels practical instead of intimidating.
        </p>
      </section>

      {aiLesson ? (
        <section className="rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Built-in lesson</p>
            <h2 className="mt-2 text-3xl font-semibold text-[color:var(--ink-strong)]">{aiLesson.title}</h2>
            <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">{aiLesson.blurb}</p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {aiLesson.steps.map((step) => (
              <article key={step.title} className="rounded-[1.5rem] bg-[color:var(--panel-soft)] p-5">
                <h3 className="text-2xl font-semibold text-[color:var(--ink-strong)]">{step.title}</h3>
                <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">{step.body}</p>
                <p className="mt-4 rounded-[1.25rem] bg-white px-4 py-3 text-base leading-7 text-[color:var(--ink-strong)]">
                  Tip: {step.tip}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <AIPracticePanel />
    </main>
  );
}
