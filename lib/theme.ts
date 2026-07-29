"use client";

import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";
const CHANGE_EVENT = "vy-themechange";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

/**
 * Reads the active theme (set pre-paint by the inline script in the root
 * layout) and lets components flip it. State stays in sync across all
 * consumers via a window event, and `mounted` guards against SSR mismatch.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read the real theme only after mount. Rendering the server value first
    // and syncing here avoids a hydration mismatch (the DOM attribute is set
    // pre-paint by the inline script in the root layout).
    const sync = () => {
      setThemeState(currentTheme());
      setMounted(true);
    };
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, []);

  const setTheme = (next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode / storage disabled — theme still applies for the session */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return { theme, setTheme, toggle, mounted };
}
