"use client";

import { useEffect, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { AccessibilityResponse } from "@/lib/ai-contracts";
import type { LessonStep, TechLesson } from "@/lib/data";
import { ListenButton } from "@/components/listen-button";
import { usePreferences } from "@/components/preferences-provider";

function buildStepText(step: LessonStep) {
  return `${step.title}. ${step.body}. Tip: ${step.tip}`;
}

export function LessonPlayer({ lessons }: { lessons: TechLesson[] }) {
  const { largeText } = usePreferences();
  const [selectedId, setSelectedId] = useState(lessons[0]?.id ?? "");
  const [stepIndex, setStepIndex] = useState(0);
  const [simplified, setSimplified] = useState<AccessibilityResponse | null>(null);
  const [showSimplified, setShowSimplified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedId) ?? lessons[0];
  const currentStep = selectedLesson.steps[stepIndex];
  const progressPercent = ((stepIndex + 1) / selectedLesson.steps.length) * 100;
  const simplifiedSteps = selectedLesson.steps.map(
    (step, index) => simplified?.simplified_steps[index] || `${step.title}: ${step.body}`
  );
  const activeStepText = showSimplified && simplified ? simplifiedSteps[stepIndex] : buildStepText(currentStep);

  useEffect(() => {
    setStepIndex(0);
    setSimplified(null);
    setShowSimplified(false);
    setError(null);
  }, [selectedId]);

  async function handleSimplify() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/accessibility-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedLesson.title,
          steps: selectedLesson.steps,
          largeText,
        }),
      });

      const data = (await response.json()) as AccessibilityResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "The accessibility helper could not simplify this lesson.");
      }

      setSimplified(data);
      setShowSimplified(true);
      setStepIndex(0);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The accessibility helper could not simplify this lesson."
      );
    } finally {
      setLoading(false);
    }
  }

  function goToStep(nextIndex: number) {
    if (nextIndex < 0 || nextIndex >= selectedLesson.steps.length) {
      return;
    }

    setStepIndex(nextIndex);
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[2rem] border border-[color:var(--border-soft)] bg-[color:var(--card)] p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-1 h-6 w-6 text-[color:var(--accent)]" />
          <div>
            <h2 className="text-3xl font-semibold text-[color:var(--ink-strong)]">Choose a lesson</h2>
            <p className="mt-2 text-lg leading-8 text-[color:var(--ink-muted)]">
              Every lesson is built for short practice, one clear action at a time.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {lessons.map((lesson) => {
            const active = lesson.id === selectedLesson.id;

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setSelectedId(lesson.id)}
                className={`w-full rounded-[1.5rem] border px-5 py-4 text-left transition focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] ${
                  active
                    ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]"
                    : "border-[color:var(--border-soft)] bg-[color:var(--panel-soft)] hover:border-[color:var(--accent)]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-semibold text-[color:var(--ink-strong)]">{lesson.title}</p>
                    <p className="mt-2 text-base leading-7 text-[color:var(--ink-muted)]">{lesson.blurb}</p>
                  </div>
                  <span className="rounded-full bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--ink-soft)]">
                    {lesson.duration}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[color:var(--border-soft)] bg-[color:var(--card)] p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
              {selectedLesson.category === "everyday" ? "Everyday skill" : selectedLesson.category === "ai" ? "AI skill" : "Safety skill"}
            </p>
            <h2 className="mt-2 font-display text-4xl text-[color:var(--ink-strong)]">{selectedLesson.title}</h2>
            <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">{selectedLesson.goal}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ListenButton text={activeStepText} label="Listen to this step" />
            <button
              type="button"
              onClick={handleSimplify}
              disabled={loading}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--card)] px-4 py-2 text-base font-medium text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] disabled:cursor-wait disabled:opacity-70"
            >
              <Sparkles className="h-5 w-5" />
              {loading ? "Simplifying..." : largeText ? "Large text version" : "Simplify lesson"}
            </button>
            {simplified ? (
              <button
                type="button"
                onClick={() => setShowSimplified(!showSimplified)}
                className="inline-flex min-h-11 items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-base font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
              >
                {showSimplified ? "Show original" : "Show simpler version"}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-6 rounded-full bg-[color:var(--panel-soft)] p-2">
          <div
            role="progressbar"
            aria-label="Lesson progress"
            aria-valuemin={1}
            aria-valuemax={selectedLesson.steps.length}
            aria-valuenow={stepIndex + 1}
            className="h-3 rounded-full bg-[color:var(--accent)] transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-3 text-base text-[color:var(--ink-soft)]" aria-live="polite">
          Step {stepIndex + 1} of {selectedLesson.steps.length}
        </p>

        <div className="mt-6 rounded-[1.75rem] bg-[color:var(--panel-soft)] p-6" aria-live="polite">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
            {showSimplified ? "Simpler reading version" : "Current step"}
          </p>
          <h3 className="mt-2 text-3xl font-semibold text-[color:var(--ink-strong)]">
            {showSimplified && simplified ? `Step ${stepIndex + 1}` : currentStep.title}
          </h3>
          <p className="mt-4 text-xl leading-9 text-[color:var(--ink-strong)]">
            {showSimplified && simplified ? simplifiedSteps[stepIndex] : currentStep.body}
          </p>
          <p className="mt-5 rounded-[1.5rem] bg-[color:var(--card)] p-4 text-lg leading-8 text-[color:var(--ink-muted)]">
            Tip: {showSimplified && simplified ? simplified.reading_tips[stepIndex % simplified.reading_tips.length] : currentStep.tip}
          </p>
          {simplified?.notice && showSimplified ? (
            <p className="mt-4 text-base text-[color:var(--ink-soft)]">{simplified.notice}</p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => goToStep(stepIndex - 1)}
            disabled={stepIndex === 0}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--card)] px-5 py-3 text-lg font-semibold text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </button>
          <button
            type="button"
            onClick={() => goToStep(stepIndex + 1)}
            disabled={stepIndex === selectedLesson.steps.length - 1}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {error ? (
          <p
            className="mt-4 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-base text-rose-900"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        ) : null}
      </section>
    </div>
  );
}
