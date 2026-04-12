"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "soft-dark";

type PreferencesContextValue = {
  largeText: boolean;
  setLargeText: (value: boolean) => void;
  theme: ThemeMode;
  setTheme: (value: ThemeMode) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [largeText, setLargeText] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    window.localStorage.setItem("silverguide-large-text", String(largeText));
    window.localStorage.setItem("silverguide-theme", theme);

    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.reading = largeText ? "large" : "normal";
  }, [largeText, theme]);

  return (
    <PreferencesContext.Provider
      value={{
        largeText,
        setLargeText,
        theme,
        setTheme,
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
