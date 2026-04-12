import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import { ModuleCard } from "@/components/module-card";
import { moduleDefinitions, pilotHighlights, techLessons } from "@/lib/data";

const featuredLessons = techLessons.filter((lesson) =>
  [
    "spot-phishing-text",
    "fake-tech-support-popup",
    "use-chatgpt-safely",
    "strong-password",
    "join-video-call",
    "secure-website",
    "suspicious-download-buttons",
  ].includes(lesson.id)
);

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2.5rem] border border-[color:var(--border-soft)] bg-[linear-gradient(135deg,rgba(249,246,239,1),rgba(238,248,245,1))] p-8 shadow-[0_24px_60px_rgba(38,51,55,0.12)] lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
              Built for GenLink Hacks
            </span>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-tight text-[color:var(--ink-strong)] sm:text-6xl">
              A calm digital coach that helps seniors feel safer and more confident online.
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-[color:var(--ink-muted)]">
              SilverGuide teaches everyday device skills, scam detection, and safe AI use with large buttons, short lessons, voice support, and practical practice screens.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/modules"
                className="inline-flex min-h-14 items-center gap-2 rounded-full bg-[color:var(--accent)] px-6 py-4 text-xl font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
              >
                Start learning
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-14 items-center rounded-full border border-[color:var(--border-soft)] bg-white px-6 py-4 text-xl font-semibold text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
              >
                How a senior center can use this
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-[2rem] bg-white p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
              <div className="flex items-start gap-4">
                <ShieldAlert className="mt-1 h-8 w-8 text-[color:var(--accent)]" />
                <div>
                  <h2 className="text-2xl font-semibold text-[color:var(--ink-strong)]">Scam Shield</h2>
                  <p className="mt-2 text-lg leading-8 text-[color:var(--ink-muted)]">
                    Seniors can practice spotting risky texts, fake popups, and urgent payment tricks in a calm environment.
                  </p>
                </div>
              </div>
            </article>
            <article className="rounded-[2rem] bg-white p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
              <div className="flex items-start gap-4">
                <Sparkles className="mt-1 h-8 w-8 text-[color:var(--accent)]" />
                <div>
                  <h2 className="text-2xl font-semibold text-[color:var(--ink-strong)]">Useful AI, not gimmicks</h2>
                  <p className="mt-2 text-lg leading-8 text-[color:var(--ink-muted)]">
                    NVIDIA NIM is used only where it helps: safer prompt coaching, short lessons, scam explanations, and simpler reading versions.
                  </p>
                </div>
              </div>
            </article>
            <article className="rounded-[2rem] bg-white p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="mt-1 h-8 w-8 text-[color:var(--accent)]" />
                <div>
                  <h2 className="text-2xl font-semibold text-[color:var(--ink-strong)]">Workshop-ready</h2>
                  <p className="mt-2 text-lg leading-8 text-[color:var(--ink-muted)]">
                    No login. No complex setup. Built-in content means a center can run it immediately on shared laptops or tablets.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {pilotHighlights.map((highlight) => (
          <article
            key={highlight}
            className="rounded-[1.75rem] border border-[color:var(--border-soft)] bg-white p-5 shadow-[0_18px_40px_rgba(38,51,55,0.08)]"
          >
            <p className="text-lg leading-8 text-[color:var(--ink-strong)]">{highlight}</p>
          </article>
        ))}
      </section>

      <section className="space-y-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Core modules</p>
          <h2 className="mt-2 font-display text-4xl text-[color:var(--ink-strong)]">Four practical paths to digital confidence</h2>
          <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">
            Each module is built around low-stress practice, large touch targets, and one clear action at a time.
          </p>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {moduleDefinitions.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)] lg:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Built-in lessons</p>
          <h2 className="mt-2 font-display text-4xl text-[color:var(--ink-strong)]">Ready for a 2 to 3 minute demo and real workshops</h2>
          <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">
            These lessons are already in the app, so organizers can demo quickly and senior centers can reuse the same flow in workshops.
          </p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {featuredLessons.map((lesson) => (
            <article key={lesson.id} className="rounded-[1.5rem] bg-[color:var(--panel-soft)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-[color:var(--ink-strong)]">{lesson.title}</h3>
                  <p className="mt-2 text-lg leading-8 text-[color:var(--ink-muted)]">{lesson.blurb}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)]">
                  {lesson.duration}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[color:var(--border-soft)] bg-[color:var(--ink-strong)] p-8 text-white shadow-[0_18px_40px_rgba(38,51,55,0.18)]">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Why it fits GenLink Hacks</p>
            <h2 className="mt-2 font-display text-4xl">Real impact, realistic delivery, and feasible AI.</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">
              SilverGuide focuses on real senior pain points, uses free browser features where possible, and stays deployable directly from GitHub to Vercel.
            </p>
          </div>
          <Link
            href="/modules"
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-6 py-4 text-xl font-semibold text-[color:var(--ink-strong)] transition hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-white/30"
          >
            Open the modules
          </Link>
        </div>
      </section>
    </main>
  );
}
