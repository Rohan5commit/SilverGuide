import Link from "next/link";
import { ModuleCard } from "@/components/module-card";
import { moduleDefinitions } from "@/lib/data";

export default function ModulesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="max-w-4xl rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-8 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Module picker</p>
        <h1 className="mt-2 font-display text-5xl text-[color:var(--ink-strong)]">Choose one place to start</h1>
        <p className="mt-4 text-xl leading-9 text-[color:var(--ink-muted)]">
          SilverGuide works best when learners focus on one clear goal. Start with the topic that feels most useful today.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/practice"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
          >
            Jump to Practice Mode
          </Link>
          <Link
            href="/about"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-white px-5 py-3 text-lg font-semibold text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
          >
            See workshop tips
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {moduleDefinitions.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </section>
    </main>
  );
}
