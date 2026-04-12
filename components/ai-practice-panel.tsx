"use client";

import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import type { LessonResponse, PromptCoachResponse } from "@/lib/ai-contracts";
import { aiPromptExamples, aiSafetyReminders } from "@/lib/data";
import { ListenButton } from "@/components/listen-button";

const starterTopics = ["reading a strange email", "using QR codes safely", "joining a video call", "checking a website link"];

export function AIPracticePanel() {
  const [prompt, setPrompt] = useState(aiPromptExamples[0]);
  const [promptResult, setPromptResult] = useState<PromptCoachResponse | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);
  const [promptLoading, setPromptLoading] = useState(false);

  const [topic, setTopic] = useState(starterTopics[0]);
  const [lessonResult, setLessonResult] = useState<LessonResponse | null>(null);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);

  const privacyReminder =
    "I will not send passwords, one-time codes, full account numbers, or private medical details to the AI helper.";

  async function handlePromptCoach() {
    if (!prompt.trim()) {
      setPromptError("Please enter a prompt first.");
      setPromptResult(null);
      return;
    }

    if (!privacyConfirmed) {
      setPromptError("Please confirm the privacy reminder before using the AI coach.");
      setPromptResult(null);
      return;
    }

    setPromptLoading(true);
    setPromptError(null);

    try {
      const response = await fetch("/api/prompt-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = (await response.json()) as PromptCoachResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "The prompt coach could not respond.");
      }

      setPromptResult(data);
    } catch (error) {
      setPromptError(error instanceof Error ? error.message : "The prompt coach could not respond.");
    } finally {
      setPromptLoading(false);
    }
  }

  async function handleLessonAgent() {
    if (!topic.trim()) {
      setLessonError("Please enter a lesson topic first.");
      setLessonResult(null);
      return;
    }

    if (!privacyConfirmed) {
      setLessonError("Please confirm the privacy reminder before using the AI helper.");
      setLessonResult(null);
      return;
    }

    setLessonLoading(true);
    setLessonError(null);

    try {
      const response = await fetch("/api/lesson-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = (await response.json()) as LessonResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "The lesson helper could not respond.");
      }

      setLessonResult(data);
    } catch (error) {
      setLessonError(error instanceof Error ? error.message : "The lesson helper could not respond.");
    } finally {
      setLessonLoading(false);
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[2rem] border border-[color:var(--border-soft)] bg-[color:var(--card)] p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 h-6 w-6 text-[color:var(--accent)]" />
          <div>
            <h2 className="text-3xl font-semibold text-[color:var(--ink-strong)]">Prompt Coach</h2>
            <p className="mt-2 text-lg leading-8 text-[color:var(--ink-muted)]">
              Start with a simple request, then let SilverGuide make it clearer and safer.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {aiPromptExamples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setPrompt(example)}
              className="rounded-full border border-[color:var(--border-soft)] bg-[color:var(--panel-soft)] px-4 py-2 text-left text-base text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
            >
              {example}
            </button>
          ))}
        </div>

        <label className="mt-6 block text-base font-semibold text-[color:var(--ink-strong)]" htmlFor="prompt-input">
          Your prompt
        </label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={7}
          aria-describedby="ai-privacy-note"
          className="mt-3 w-full rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--panel-soft)] px-5 py-4 text-lg leading-8 text-[color:var(--ink-strong)] outline-none transition focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--focus-ring)]"
        />
        <div className="mt-4 rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--panel-soft)] px-4 py-4">
          <p id="ai-privacy-note" className="text-base leading-7 text-[color:var(--ink-muted)]">
            SilverGuide redacts obvious personal details before sending text to AI, but private information is still not needed here.
          </p>
          <label className="mt-3 flex items-start gap-3 text-base leading-7 text-[color:var(--ink-strong)]">
            <input
              type="checkbox"
              checked={privacyConfirmed}
              onChange={(event) => setPrivacyConfirmed(event.target.checked)}
              className="mt-1 h-5 w-5 rounded border-[color:var(--border-soft)] text-[color:var(--accent)] focus:ring-[color:var(--focus-ring)]"
            />
            <span>{privacyReminder}</span>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePromptCoach}
            disabled={promptLoading || !privacyConfirmed}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] disabled:cursor-wait disabled:opacity-70"
          >
            {promptLoading ? "Coaching..." : "Improve this prompt"}
          </button>
          <ListenButton text={prompt} label="Listen to prompt" />
        </div>

        {promptError ? (
          <p
            className="mt-4 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-base text-rose-900"
            role="alert"
            aria-live="assertive"
          >
            {promptError}
          </p>
        ) : null}

        {promptResult ? (
          <div className="mt-6 rounded-[1.75rem] border border-[color:var(--border-soft)] bg-[color:var(--panel-soft)] p-5" aria-live="polite">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[color:var(--card)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
                Source: {promptResult.source === "nim" ? "NVIDIA NIM" : "Built-in backup"}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[color:var(--ink-strong)]">Suggested prompt</h3>
            <p className="mt-3 whitespace-pre-line rounded-[1.5rem] bg-[color:var(--card)] p-4 text-lg leading-8 text-[color:var(--ink-strong)]">
              {promptResult.improved_prompt}
            </p>
            <h4 className="mt-5 text-lg font-semibold text-[color:var(--ink-strong)]">Why it helps</h4>
            <ul className="mt-3 space-y-3 text-lg leading-8 text-[color:var(--ink-muted)]">
              {promptResult.why_it_helps.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" aria-hidden />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-lg leading-8 text-amber-950">
              Privacy reminder: {promptResult.privacy_warning}
            </p>
            {promptResult.notice ? <p className="mt-4 text-base text-[color:var(--ink-soft)]">{promptResult.notice}</p> : null}
          </div>
        ) : null}
      </section>

      <section className="space-y-8">
        <div className="rounded-[2rem] border border-[color:var(--border-soft)] bg-[color:var(--card)] p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
          <div className="flex items-start gap-3">
            <Bot className="mt-1 h-6 w-6 text-[color:var(--accent)]" />
            <div>
              <h2 className="text-3xl font-semibold text-[color:var(--ink-strong)]">Ask for a short lesson</h2>
              <p className="mt-2 text-lg leading-8 text-[color:var(--ink-muted)]">
                The Lesson Agent can turn a topic into a short, confidence-building mini lesson.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {starterTopics.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => setTopic(starter)}
                className="rounded-full border border-[color:var(--border-soft)] bg-[color:var(--panel-soft)] px-4 py-2 text-base text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
              >
                {starter}
              </button>
            ))}
          </div>

          <label className="mt-6 block text-base font-semibold text-[color:var(--ink-strong)]" htmlFor="lesson-topic">
            Lesson topic
          </label>
          <input
            id="lesson-topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            aria-describedby="ai-privacy-note"
            className="mt-3 w-full rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--panel-soft)] px-5 py-4 text-lg text-[color:var(--ink-strong)] outline-none transition focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--focus-ring)]"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLessonAgent}
              disabled={lessonLoading || !privacyConfirmed}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] disabled:cursor-wait disabled:opacity-70"
            >
              {lessonLoading ? "Building lesson..." : "Teach this topic"}
            </button>
            <ListenButton text={topic} label="Listen to topic" />
          </div>

          {lessonError ? (
            <p
              className="mt-4 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-base text-rose-900"
              role="alert"
              aria-live="assertive"
            >
              {lessonError}
            </p>
          ) : null}

          {lessonResult ? (
            <div className="mt-6 rounded-[1.75rem] border border-[color:var(--border-soft)] bg-[color:var(--panel-soft)] p-5" aria-live="polite">
              <span className="rounded-full bg-[color:var(--card)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
                Source: {lessonResult.source === "nim" ? "NVIDIA NIM" : "Built-in backup"}
              </span>
              <h3 className="mt-4 font-display text-3xl text-[color:var(--ink-strong)]">{lessonResult.title}</h3>
              <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">{lessonResult.intro}</p>
              <ol className="mt-5 space-y-4 text-lg leading-8 text-[color:var(--ink-strong)]">
                {lessonResult.steps.map((step) => (
                  <li key={step} className="rounded-[1.25rem] bg-[color:var(--card)] p-4">
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-lg leading-8 text-emerald-950">
                Safety tip: {lessonResult.safety_tip}
              </p>
              {lessonResult.notice ? <p className="mt-4 text-base text-[color:var(--ink-soft)]">{lessonResult.notice}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="rounded-[2rem] border border-[color:var(--border-soft)] bg-[color:var(--card)] p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Safe AI habits</p>
          <ul className="mt-4 space-y-4 text-lg leading-8 text-[color:var(--ink-muted)]">
            {aiSafetyReminders.map((reminder) => (
              <li key={reminder} className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" aria-hidden />
                <span>{reminder}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
