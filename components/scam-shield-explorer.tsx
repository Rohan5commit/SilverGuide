"use client";

import { useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import type { ScamResponse } from "@/lib/ai-contracts";
import type { ScamExample } from "@/lib/data";
import { scamExamples } from "@/lib/data";
import { ListenButton } from "@/components/listen-button";

const answerLabels = {
  safe: "Safe",
  suspicious: "Suspicious",
  very_suspicious: "Very suspicious",
};

const answerOptions: Array<{ value: ScamExample["verdict"]; label: string }> = [
  { value: "safe", label: "Looks safe" },
  { value: "suspicious", label: "Looks suspicious" },
  { value: "very_suspicious", label: "Very suspicious" },
];

export function ScamShieldExplorer() {
  const [selectedId, setSelectedId] = useState(scamExamples[0].id);
  const [answer, setAnswer] = useState<ScamExample["verdict"] | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [analysis, setAnalysis] = useState<ScamResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);

  const currentIndex = scamExamples.findIndex((item) => item.id === selectedId);
  const currentExample = scamExamples[currentIndex];

  const resultTone = !answer
    ? null
    : answer === currentExample.verdict
      ? {
          title: "Good catch",
          body: `You marked this as ${answerLabels[currentExample.verdict].toLowerCase()}, which matches the lesson.`,
          toneClass: "border-emerald-200 bg-emerald-50 text-emerald-900",
        }
      : {
          title: "Let’s slow it down",
          body: `The safer answer here is ${answerLabels[currentExample.verdict].toLowerCase()}. Review the clues below and try the next one with the same calm process.`,
          toneClass: "border-amber-200 bg-amber-50 text-amber-950",
        };

  function goToExample(nextIndex: number) {
    const nextExample = scamExamples[nextIndex];
    if (!nextExample) {
      return;
    }

    setSelectedId(nextExample.id);
    setAnswer(null);
  }

  async function handleAnalyze() {
    if (!customMessage.trim()) {
      setAnalysisError("Paste a message or popup first.");
      setAnalysis(null);
      return;
    }

    if (!privacyConfirmed) {
      setAnalysisError("Please confirm the privacy reminder before using the AI scam checker.");
      setAnalysis(null);
      return;
    }

    setLoading(true);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/scam-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: customMessage }),
      });

      const data = (await response.json()) as ScamResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "The scam checker could not review this message.");
      }

      setAnalysis(data);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "The scam checker could not review this message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-[color:var(--border-soft)] bg-[color:var(--card)] p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Practice scenario</p>
            <h2 className="mt-2 font-display text-4xl text-[color:var(--ink-strong)]">{currentExample.title}</h2>
            <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">{currentExample.summary}</p>
          </div>
          <div className="rounded-3xl bg-[color:var(--panel-soft)] px-5 py-4 text-base font-medium text-[color:var(--ink-strong)]">
            Scenario {currentIndex + 1} of {scamExamples.length}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => goToExample(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--card)] px-4 py-2 text-base font-medium text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </button>
          <button
            type="button"
            onClick={() => goToExample(currentIndex + 1)}
            disabled={currentIndex === scamExamples.length - 1}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--card)] px-4 py-2 text-base font-medium text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ArrowRight className="h-5 w-5" />
          </button>
          <ListenButton
            text={`${currentExample.title}. ${currentExample.message}`}
            label="Listen to example"
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-[color:var(--border-soft)] bg-[color:var(--card)] p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <div className="rounded-[1.75rem] bg-[color:var(--panel-soft)] p-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[color:var(--card)] px-3 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]">
              {currentExample.channel}
            </span>
            <span className="text-base text-[color:var(--ink-muted)]">From: {currentExample.sender}</span>
          </div>
          <p className="text-xl leading-9 text-[color:var(--ink-strong)]">{currentExample.message}</p>
        </div>

        <div className="mt-6">
          <p className="text-lg font-semibold text-[color:var(--ink-strong)]">What does your instinct say?</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {answerOptions.map((option) => {
              const active = answer === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAnswer(option.value)}
                  aria-pressed={active}
                  className={`min-h-16 rounded-[1.5rem] border px-4 py-4 text-left text-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] ${
                    active
                      ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
                      : "border-[color:var(--border-soft)] bg-[color:var(--card)] text-[color:var(--ink-strong)] hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {resultTone ? (
          <div className={`mt-6 rounded-[1.5rem] border px-5 py-4 ${resultTone.toneClass}`} aria-live="polite">
            <p className="text-xl font-semibold">{resultTone.title}</p>
            <p className="mt-2 text-lg leading-8">{resultTone.body}</p>
          </div>
        ) : null}

        {answer ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-[color:var(--border-soft)] bg-[color:var(--card)] p-5">
              <div className="flex flex-wrap items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-[color:var(--accent)]" />
                <h3 className="text-2xl font-semibold text-[color:var(--ink-strong)]">Red flags</h3>
              </div>
              <ul className="mt-4 space-y-4 text-lg leading-8 text-[color:var(--ink-muted)]">
                {currentExample.redFlags.map((flag) => (
                  <li key={flag} className="flex items-start gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" aria-hidden />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-[1.5rem] bg-[color:var(--panel-soft)] p-4 text-lg leading-8 text-[color:var(--ink-strong)]">
                {currentExample.simpleExplanation}
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-[color:var(--border-soft)] bg-[color:var(--panel-soft)] p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-[color:var(--accent-ink)]" />
                <h3 className="text-2xl font-semibold text-[color:var(--ink-strong)]">What to do instead</h3>
              </div>
              <p className="mt-4 text-lg leading-8 text-[color:var(--ink-strong)]">{currentExample.recommendedAction}</p>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Never do this</p>
              <ul className="mt-3 space-y-3 text-lg leading-8 text-[color:var(--ink-muted)]">
                {currentExample.neverDoThis.map((warning) => (
                  <li key={warning} className="flex items-start gap-3">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--accent-ink)]" aria-hidden />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-[2rem] border border-[color:var(--border-soft)] bg-[color:var(--card)] p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 h-6 w-6 text-[color:var(--accent)]" />
          <div>
            <h3 className="text-2xl font-semibold text-[color:var(--ink-strong)]">Ask the AI scam checker</h3>
            <p className="mt-2 text-lg leading-8 text-[color:var(--ink-muted)]">
              Paste a message, popup warning, or email line. SilverGuide uses NVIDIA NIM when available and falls back to a built-in safety review if not.
            </p>
          </div>
        </div>
        <label className="mt-5 block text-base font-semibold text-[color:var(--ink-strong)]" htmlFor="custom-scam-message">
          Message to review
        </label>
        <textarea
          id="custom-scam-message"
          value={customMessage}
          onChange={(event) => setCustomMessage(event.target.value)}
          rows={6}
          aria-describedby="scam-privacy-note"
          className="mt-3 w-full rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--panel-soft)] px-5 py-4 text-lg leading-8 text-[color:var(--ink-strong)] outline-none transition focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--focus-ring)]"
          placeholder="Example: Your account will be suspended today unless you confirm your password."
        />
        <div className="mt-4 rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--panel-soft)] px-4 py-4">
          <p id="scam-privacy-note" className="text-base leading-7 text-[color:var(--ink-muted)]">
            Private details are not needed. SilverGuide redacts obvious account numbers, phone numbers, and codes before AI review.
          </p>
          <label className="mt-3 flex items-start gap-3 text-base leading-7 text-[color:var(--ink-strong)]">
            <input
              type="checkbox"
              checked={privacyConfirmed}
              onChange={(event) => setPrivacyConfirmed(event.target.checked)}
              className="mt-1 h-5 w-5 rounded border-[color:var(--border-soft)] text-[color:var(--accent)] focus:ring-[color:var(--focus-ring)]"
            />
            <span>I removed or do not need to include passwords, one-time codes, full account numbers, or private medical details.</span>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !privacyConfirmed}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? "Checking..." : "Explain this message"}
          </button>
          <ListenButton text={customMessage} label="Listen to pasted message" />
        </div>

        {analysisError ? (
          <p
            className="mt-4 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-base text-rose-900"
            role="alert"
            aria-live="assertive"
          >
            {analysisError}
          </p>
        ) : null}

        {analysis ? (
          <div className="mt-6 rounded-[1.75rem] border border-[color:var(--border-soft)] bg-[color:var(--panel-soft)] p-5" aria-live="polite">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[color:var(--card)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
                Verdict: {answerLabels[analysis.verdict]}
              </span>
              <span className="text-sm text-[color:var(--ink-soft)]">
                Source: {analysis.source === "nim" ? "NVIDIA NIM" : "Built-in backup"}
              </span>
            </div>
            <ul className="mt-4 space-y-3 text-lg leading-8 text-[color:var(--ink-muted)]">
              {analysis.red_flags.map((flag) => (
                <li key={flag} className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" aria-hidden />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-lg leading-8 text-[color:var(--ink-strong)]">{analysis.simple_explanation}</p>
            <p className="mt-4 rounded-[1.5rem] bg-[color:var(--card)] p-4 text-lg leading-8 text-[color:var(--ink-strong)]">
              Recommended action: {analysis.recommended_action}
            </p>
            {analysis.notice ? (
              <p className="mt-4 text-base text-[color:var(--ink-soft)]">{analysis.notice}</p>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
