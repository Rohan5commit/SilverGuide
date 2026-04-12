"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";

type ListenButtonProps = {
  text: string;
  label?: string;
};

export function ListenButton({ text, label = "Listen to this" }: ListenButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const supported = useSyncExternalStore(
    () => () => undefined,
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    () => false
  );

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function handleClick() {
    if (!supported || !text.trim()) {
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!supported}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-white px-4 py-2 text-base font-medium text-[color:var(--ink-strong)] shadow-sm transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)] focus:outline-none focus:ring-4 focus:ring-[color:var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
      aria-pressed={speaking}
    >
      {speaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      {speaking ? "Stop audio" : label}
    </button>
  );
}
