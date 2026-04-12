"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

type ThemeMode = "light" | "soft-dark";

type PreferencesContextValue = {
  largeText: boolean;
  setLargeText: (value: boolean) => void;
  theme: ThemeMode;
  setTheme: (value: ThemeMode) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);
const defaultPreferences: { largeText: boolean; theme: ThemeMode } = {
  largeText: false,
  theme: "light",
};
const preferencesEvent = "silverguide-preferences-change";

function readPreferences(): { largeText: boolean; theme: ThemeMode } {
  if (typeof window === "undefined") {
    return defaultPreferences;
  }

  const savedLargeText = window.localStorage.getItem("silverguide-large-text");
  const savedTheme = window.localStorage.getItem("silverguide-theme");

  return {
    largeText: savedLargeText === "true",
    theme: savedTheme === "soft-dark" ? "soft-dark" : "light",
  };
}

function applyPreferences({ largeText, theme }: { largeText: boolean; theme: ThemeMode }) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.reading = largeText ? "large" : "normal";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  window.addEventListener(preferencesEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(preferencesEvent, callback);
  };
}

function writePreferences(next: { largeText: boolean; theme: ThemeMode }) {
  window.localStorage.setItem("silverguide-large-text", String(next.largeText));
  window.localStorage.setItem("silverguide-theme", next.theme);
  applyPreferences(next);
  window.dispatchEvent(new Event(preferencesEvent));
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const preferences = useSyncExternalStore(subscribe, readPreferences, () => defaultPreferences);

  useEffect(() => {
    applyPreferences(preferences);
  }, [preferences]);

  return (
    <PreferencesContext.Provider
      value={{
        largeText: preferences.largeText,
        setLargeText: (value) => writePreferences({ ...preferences, largeText: value }),
        theme: preferences.theme,
        setTheme: (value) => writePreferences({ ...preferences, theme: value }),
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }

  return context;
}
