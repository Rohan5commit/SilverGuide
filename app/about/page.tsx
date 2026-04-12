import Link from "next/link";

const workshopSteps = [
  "Open SilverGuide on a shared screen or individual tablets.",
  "Let each learner choose one module that feels useful today.",
  "Have a volunteer read the screen aloud or use the built-in voice button.",
  "Pause after each scenario and ask, 'What clue helped you decide?'",
  "Finish with Practice Mode and review the session summary together.",
];

const hardware = ["A modern browser on a laptop, desktop, or tablet", "Speakers or headphones if using voice playback", "Internet only if the NVIDIA NIM features are needed"];

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="max-w-4xl rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-8 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">About SilverGuide</p>
        <h1 className="mt-2 font-display text-5xl text-[color:var(--ink-strong)]">A realistic tool for senior centers, family helpers, and first-time learners.</h1>
        <p className="mt-4 text-xl leading-9 text-[color:var(--ink-muted)]">
          SilverGuide avoids dense dashboards and chatbot overload. It is a structured teaching tool with optional AI support, built-in lessons, and workshop-friendly flows.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
          <h2 className="text-3xl font-semibold text-[color:var(--ink-strong)]">How to run a workshop</h2>
          <ol className="mt-5 space-y-4 text-lg leading-8 text-[color:var(--ink-muted)]">
            {workshopSteps.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-soft)] font-semibold text-[color:var(--accent-ink)]">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
          <h2 className="text-3xl font-semibold text-[color:var(--ink-strong)]">What you need</h2>
          <ul className="mt-5 space-y-4 text-lg leading-8 text-[color:var(--ink-muted)]">
            {hardware.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-[1.5rem] bg-[color:var(--panel-soft)] p-4 text-lg leading-8 text-[color:var(--ink-strong)]">
            The MVP does not require accounts, databases, or staff training before the first session.
          </p>
        </article>
      </section>

      <section className="rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <h2 className="text-3xl font-semibold text-[color:var(--ink-strong)]">Why the product feels approachable</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[1.5rem] bg-[color:var(--panel-soft)] p-5">
            <h3 className="text-2xl font-semibold text-[color:var(--ink-strong)]">Readable</h3>
            <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">Large buttons, strong contrast, left-aligned text, and optional large-text mode.</p>
          </article>
          <article className="rounded-[1.5rem] bg-[color:var(--panel-soft)] p-5">
            <h3 className="text-2xl font-semibold text-[color:var(--ink-strong)]">Respectful</h3>
            <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">The tone is calm and confidence-building, not childish or patronizing.</p>
          </article>
          <article className="rounded-[1.5rem] bg-[color:var(--panel-soft)] p-5">
            <h3 className="text-2xl font-semibold text-[color:var(--ink-strong)]">Feasible</h3>
            <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">It works with built-in content first and uses AI only when it adds clear value.</p>
          </article>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/modules"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
          >
            Open the modules
          </Link>
          <Link
            href="/practice"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-white px-5 py-3 text-lg font-semibold text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
          >
            Try Practice Mode
          </Link>
        </div>
      </section>
    </main>
  );
}
