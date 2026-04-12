import Link from "next/link";
import { ArrowRight, CheckCircle2, MonitorSmartphone, ShieldAlert, Sparkles } from "lucide-react";
import type { ModuleDefinition } from "@/lib/data";

const iconMap = {
  shield: ShieldAlert,
  sparkles: Sparkles,
  monitor: MonitorSmartphone,
  check: CheckCircle2,
};

export function ModuleCard({ module }: { module: ModuleDefinition }) {
  const Icon = iconMap[module.icon];

  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]">
        <Icon className="h-7 w-7" />
      </div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Module</p>
      <h3 className="font-display text-3xl text-[color:var(--ink-strong)]">{module.title}</h3>
      <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">{module.summary}</p>
      <p className="mt-4 rounded-3xl bg-[color:var(--panel-soft)] p-4 text-base leading-7 text-[color:var(--ink-strong)]">
        {module.audienceBenefit}
      </p>
      <ul className="mt-5 space-y-3 text-base leading-7 text-[color:var(--ink-muted)]">
        {module.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3">
            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" aria-hidden />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <p className="mb-4 rounded-3xl border border-dashed border-[color:var(--border-soft)] px-4 py-3 text-sm leading-6 text-[color:var(--ink-soft)]">
          Demo moment: {module.demoMoment}
        </p>
        <Link
          href={module.route}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
        >
          Open {module.title}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </article>
  );
}
