"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { practiceQuestions } from "@/lib/data";

type QuizState = "question" | "incorrect" | "correct";

type SessionSummary = {
  completedAt: string;
  total: number;
  firstTryCorrect: number;
  learned: string[];
  remember: string[];
  watchOutFor: string[];
  encouragement: string;
};

const storageKey = "silverguide-session-summary";

export function PracticeQuiz() {
  const router = useRouter();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [state, setState] = useState<QuizState>("question");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [missedCurrent, setMissedCurrent] = useState(false);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [watchOutFor, setWatchOutFor] = useState<string[]>([]);

  const question = practiceQuestions[questionIndex];
  const progressPercent = ((questionIndex + 1) / practiceQuestions.length) * 100;

  function handleChoice(choiceIndex: number) {
    setSelectedIndex(choiceIndex);

    if (choiceIndex === question.correctIndex) {
      setState("correct");
      return;
    }

    if (!missedCurrent) {
      setMissedCurrent(true);
      setWatchOutFor((current) =>
        current.includes(question.watchOutFor) ? current : [...current, question.watchOutFor]
      );
    }
    setState("incorrect");
  }

  function handleTryAgain() {
    setSelectedIndex(null);
    setState("question");
  }

  function handleShowAnswer() {
    setSelectedIndex(question.correctIndex);
    setState("correct");
  }

  function finishQuestion() {
    const wasFirstTryCorrect = !missedCurrent;
    const nextFirstTryCorrect = wasFirstTryCorrect ? firstTryCorrect + 1 : firstTryCorrect;

    if (wasFirstTryCorrect) {
      setFirstTryCorrect(nextFirstTryCorrect);
    }

    if (questionIndex === practiceQuestions.length - 1) {
      const learned = [...new Set(practiceQuestions.map((item) => item.takeaway))];
      const watchList = watchOutFor.length ? watchOutFor : ["Urgent messages that ask for quick action"];
      const summary: SessionSummary = {
        completedAt: new Date().toISOString(),
        total: practiceQuestions.length,
        firstTryCorrect: nextFirstTryCorrect,
        learned,
        remember: learned.slice(0, 3),
        watchOutFor: watchList.slice(0, 3),
        encouragement:
          nextFirstTryCorrect >= 6
            ? "You are building strong digital safety habits."
            : nextFirstTryCorrect >= 4
              ? "You are learning the right patterns. One calm pause makes a big difference."
              : "You practiced the most important skill today: slowing down before you respond.",
      };

      window.localStorage.setItem(storageKey, JSON.stringify(summary));
      router.push("/summary");
      return;
    }

    setQuestionIndex(questionIndex + 1);
    setState("question");
    setSelectedIndex(null);
    setMissedCurrent(false);
  }

  return (
    <div className="rounded-[2rem] border border-[color:var(--border-soft)] bg-white p-6 shadow-[0_18px_40px_rgba(38,51,55,0.08)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Friendly practice</p>
          <h2 className="mt-2 font-display text-4xl text-[color:var(--ink-strong)]">One calm question at a time</h2>
          <p className="mt-3 text-lg leading-8 text-[color:var(--ink-muted)]">
            This is not a test. It is a replayable confidence builder.
          </p>
        </div>
        <div className="rounded-3xl bg-[color:var(--panel-soft)] px-5 py-4 text-base font-medium text-[color:var(--ink-strong)]">
          Question {questionIndex + 1} of {practiceQuestions.length}
        </div>
      </div>

      <div className="mt-6 rounded-full bg-[color:var(--panel-soft)] p-2">
        <div
          className="h-3 rounded-full bg-[color:var(--accent)] transition-all"
          style={{ width: `${progressPercent}%` }}
          aria-hidden
        />
      </div>

      <div className="mt-8 rounded-[1.75rem] bg-[color:var(--panel-soft)] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
          {question.category === "scam" ? "Scam safety" : question.category === "ai" ? "AI safety" : "Everyday tech"}
        </p>
        <h3 className="mt-3 text-3xl font-semibold leading-tight text-[color:var(--ink-strong)]">{question.question}</h3>
      </div>

      <div className="mt-6 grid gap-4">
        {question.choices.map((choice, index) => {
          const selected = selectedIndex === index;
          const shouldHighlightCorrect = state === "correct" && index === question.correctIndex;

          return (
            <button
              key={choice}
              type="button"
              onClick={() => handleChoice(index)}
              disabled={state !== "question"}
              className={`min-h-16 rounded-[1.5rem] border px-5 py-4 text-left text-lg font-medium transition focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] disabled:cursor-not-allowed ${
                shouldHighlightCorrect
                  ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                  : selected
                    ? "border-amber-300 bg-amber-50 text-amber-950"
                    : "border-[color:var(--border-soft)] bg-white text-[color:var(--ink-strong)] hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]"
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {state === "incorrect" ? (
        <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <p className="text-xl font-semibold">Try again</p>
          <p className="mt-3 text-lg leading-8">{question.explanation}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleTryAgain}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={handleShowAnswer}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-white px-5 py-3 text-lg font-semibold text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
            >
              Show the safer answer
            </button>
          </div>
        </div>
      ) : null}

      {state === "correct" ? (
        <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
          <div className="flex items-start gap-3">
            <Trophy className="mt-1 h-6 w-6" />
            <div>
              <p className="text-xl font-semibold">{missedCurrent ? "You worked through it" : "Well done"}</p>
              <p className="mt-3 text-lg leading-8">{question.explanation}</p>
              <p className="mt-4 rounded-[1.25rem] bg-white px-4 py-3 text-lg leading-8 text-[color:var(--ink-strong)]">
                Remember: {question.takeaway}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={finishQuestion}
            className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-lg font-semibold text-white transition hover:bg-[color:var(--accent-deep)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/modules"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-white px-5 py-3 text-lg font-semibold text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
        >
          Back to modules
        </Link>
        <button
          type="button"
          onClick={() => {
            setQuestionIndex(0);
            setState("question");
            setSelectedIndex(null);
            setMissedCurrent(false);
            setFirstTryCorrect(0);
            setWatchOutFor([]);
          }}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-white px-5 py-3 text-lg font-semibold text-[color:var(--ink-strong)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)]"
        >
          <RotateCcw className="h-5 w-5" />
          Restart
        </button>
      </div>
    </div>
  );
}

export function readStoredSessionSummary() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionSummary;
  } catch {
    return null;
  }
}
