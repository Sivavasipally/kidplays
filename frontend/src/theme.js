import { useState, useEffect, useCallback } from "react";

// Day/Night theme, persisted locally. Applied as a `data-theme` attribute on
// <html> so the whole design system (and Blockly, via CSS overrides) re-skins.
const KEY = "kidplays:theme";

export function getInitialTheme() {
  const saved = localStorage.getItem(KEY);
  if (saved === "day" || saved === "night") return saved;
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "night" : "day";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "day" ? "night" : "day")),
    []
  );

  return { theme, toggle };
}
